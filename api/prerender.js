export default async function handler(req, res) {
    if (!process.env.PRERENDER_TOKEN) {
        return res.status(500).send('No token');
    }

    const domain = 'www.piper-trail.com';
    const path = req.url.replace('/api/prerender', '').replace('?path=', '');

    const targetUrl = `https://${domain}${path}`;
    const prerenderUrl = `https://service.prerender.io/${targetUrl}`;

    console.log('Target URL:', targetUrl);
    console.log('Prerender URL:', prerenderUrl);

    try {
        const response = await fetch(prerenderUrl, {
            headers: {
                'X-Prerender-Token': process.env.PRERENDER_TOKEN
            }
        });

        const html = await response.text();

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed');
    }
}