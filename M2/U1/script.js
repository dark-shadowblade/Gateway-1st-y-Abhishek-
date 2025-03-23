// Define the subject (change this to update across all pages)
const SUBJECT = "Maths-II";

// Update the subject name in the title and heading
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('page-title').textContent = `${SUBJECT}: Unit 1 Lecture 1`;
    document.getElementById('subject-name').textContent = SUBJECT;
    fetchHTML(); // Fetch the lecture video once the page loads
});

async function fetchHTML() {
    try {
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
                if (publinkData?.variants?.[0]?.path) {
                    const fullLink = 'https://p-def6.pcloud.com' + publinkData.variants[0].path;

                    // Clear and add the iframe
                    const iframeContainer = document.getElementById('iframe-container');
                    iframeContainer.innerHTML = ''; // Ensure no duplicate iframes

                    const iframe = document.createElement('iframe');
                    iframe.src = fullLink;
                    iframe.style.width = "100%";
                    iframe.style.height = "500px";
                    iframeContainer.appendChild(iframe);

                    // Show buttons after video loads
                    document.getElementById('fullscreen-btn').style.display = 'inline-block';
                    document.getElementById('notes-btn').style.display = 'inline-block';
                    document.getElementById('dpp-btn').style.display = 'inline-block';

                    // Fullscreen function
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

                    // Open Notes and DPP links
                    document.querySelectorAll('.btn').forEach(button => {
                        button.addEventListener('click', () => {
                            const link = button.getAttribute('data-link');
                            if (link) window.open(link, '_blank');
                        });
                    });

                } else {
                    throw new Error('Path not found in publinkData');
                }
            } else {
                throw new Error('Could not find publinkData object');
            }
        } else {
            throw new Error('publinkData script not found');
        }
    } catch (error) {
        document.getElementById('path-link').textContent = 'Error: ' + error.message;
    }
}
