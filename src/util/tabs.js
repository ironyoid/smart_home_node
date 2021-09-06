{
    const links = document.querySelectorAll('header nav button');

    const handleClick = (i) => () => {
        localStorage.setItem('pageIndex', i);
        links.forEach((link, inner) => {
            if (+i === inner) {
                link.classList.add('active');
                document.getElementById(link.getAttribute('tabId')).style.display = 'block';
                return;
            }

            link.classList.remove('active');
            document.getElementById(link.getAttribute('tabId')).style.display = 'none';
        });
    };

    // Initial page
    const pageIndex = localStorage.getItem('pageIndex', 0);
    handleClick(pageIndex)();

    links.forEach((link, i) => {
        link.addEventListener('click', handleClick(i), false);
    });
}