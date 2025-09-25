// Simple HTML include for static sites
function includeHTML(selector, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.querySelectorAll(selector).forEach(el => {
                el.innerHTML = data;
            });
        });
}
// Usage example (call in each page):
// includeHTML('.navbar-include', 'navbar.html');
// includeHTML('.footer-include', 'footer.html');
