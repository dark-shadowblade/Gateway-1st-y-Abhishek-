async function fetchHTML() {
    try {
        // Get lecture link from the HTML
        const baseLink = document.getElementById('lecture-link').href;

        const response = await fetch(baseLink);
        if (!response.ok) throw new Error('Failed to fetch HTML content');
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const scriptTags = doc.querySelectorAll('script');
        let publinkDataScript = '';

        scriptTags.forEach(script => {
            if (script.textContent.includes('publinkData')) {
                publinkDataScript = script.textContent;
            }
        });

        if (publinkDataScript) {
            const dataMatch = publinkDataScript.match(/var publinkData = ({.*?});/s);
            if (dataMatch && dataMatch[1]) {
                const publinkData = JSON.parse(dataMatch[1]);
                if (publinkData && publinkData.variants && publinkData.variants[0]) {
                    const pathLink = publinkData.variants[0].path;
                    const baseURL = 'https://p-def6.pcloud.com';
                    const fullLink = baseURL + pathLink;

                    const iframe = document.createElement('iframe');
                    iframe.src = fullLink;
                    document.getElementById('iframe-container').appendChild(iframe);

                    document.getElementById('fullscreen-btn').style.display = 'inline-block';
                    document.getElementById('notes-btn').style.display = 'inline-block';
                    document.getElementById('dpp-btn').style.display = 'inline-block';

                    document.getElementById('fullscreen-btn').addEventListener('click', () => {
                        if (iframe.requestFullscreen) {
                            iframe.requestFullscreen();
                        } else if (iframe.mozRequestFullScreen) {
                            iframe.mozRequestFullScreen();
                        } else if (iframe.webkitRequestFullscreen) {
                            iframe.webkitRequestFullscreen();
                        } else if (iframe.msRequestFullscreen) {
                            iframe.msRequestFullscreen();
                        }
                    });

                    document.querySelectorAll('.btn').forEach(button => {
                        button.addEventListener('click', () => {
                            const link = button.getAttribute('data-link');
                            if (link) window.open(link, '_blank');
                        });
                    });

                } else {
                    document.getElementById('path-link').textContent = 'Error: Path not found';
                }
            } else {
                document.getElementById('path-link').textContent = 'Error: Could not find publinkData object';
            }
        } else {
            document.getElementById('path-link').textContent = 'Error: publinkData script not found';
        }
    } catch (error) {
        document.getElementById('path-link').textContent = 'Error: ' + error.message;
    }
}

fetchHTML();
