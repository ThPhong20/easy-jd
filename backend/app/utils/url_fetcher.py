import ipaddress
import socket
import httpx
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse

_BLOCKED_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
]


def _is_safe_url(url: str) -> tuple[bool, str]:
    """
    Return (is_safe, canonical_url).

    Validates that the URL resolves to a public IP address and rebuilds the
    URL from its parsed components to break tainted-data flow.
    """
    parsed = urlparse(url)
    hostname = parsed.hostname
    if not hostname:
        return False, ""
    try:
        addr = socket.getaddrinfo(hostname, None)[0][4][0]
        ip = ipaddress.ip_address(addr)
        for network in _BLOCKED_NETWORKS:
            if ip in network:
                return False, ""
    except (socket.gaierror, ValueError):
        return False, ""

    # Reconstruct URL from parsed, validated parts to avoid tainted-data flow
    port_part = f":{parsed.port}" if parsed.port else ""
    path_part = parsed.path or "/"
    query_part = f"?{parsed.query}" if parsed.query else ""
    scheme = parsed.scheme if parsed.scheme in ("http", "https") else "https"
    canonical = f"{scheme}://{hostname}{port_part}{path_part}{query_part}"
    return True, canonical


async def fetch_and_clean_jd(url: str) -> str:
    """Fetch a webpage and extract the main text content as a job description."""
    is_safe, safe_url = _is_safe_url(url)
    if not is_safe:
        raise ValueError("The provided URL resolves to a private or restricted address.")

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
        result = await client.get(safe_url, headers=headers)
        result.raise_for_status()
        html = result.text

    soup = BeautifulSoup(html, "lxml")

    # Remove script and style tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    # Try to find the main content container
    main_content = (
        soup.find("main")
        or soup.find(id=re.compile(r"job|description|content", re.I))
        or soup.find(class_=re.compile(r"job|description|content|listing", re.I))
        or soup.body
    )

    if main_content:
        text = main_content.get_text(separator="\n")
    else:
        text = soup.get_text(separator="\n")

    # Clean up whitespace
    lines = [line.strip() for line in text.splitlines()]
    cleaned = "\n".join(line for line in lines if line)

    return cleaned
