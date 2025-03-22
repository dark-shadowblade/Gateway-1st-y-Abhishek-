// Define the subject (change this to update across all pages)
const SUBJECT = "Maths-II"; // Example subject, change it as needed

// Update the subject name in the title and heading
document.getElementById('page-title').textContent = `${SUBJECT}: Unit 1 Lecture 1`;
document.getElementById('subject-name').textContent = SUBJECT;

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

                    const iframeContainer = document.getElementById('iframe-container');
                    iframeContainer.innerHTML = ''; // Clear previous content

                    const iframe = document.createElement('iframe');
                    iframe.src = fullLink;
                    iframeContainer.appendChild(iframe);

                    document.getElementById('fullscreen-btn').style.display = 'inline-block';
                    document.getElementById('notes-btn').style.display = 'inline-block';
                    document.getElementById('dpp-btn').style.display = 'inline-block';

                    document.getElementById('fullscreen-btn').onclick = () => iframe.requestFullscreen?.();

                    document.querySelectorAll('.btn').forEach(button => {
                        button.onclick = () => {
                            const link = button.getAttribute('data-link');
                            if (link) window.open(link, '_blank');
                        };
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

fetchHTML();
