export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';

    // Prerender.io로 전달
    const prerenderUrl = `https://service.prerender.io/https://piper-trail.com${path}`;

    try {
        const response = await fetch(prerenderUrl, {
            headers: {
                'X-Prerender-Token': process.env.PRERENDER_TOKEN,
            }
        });

        const html = await response.text();

        return new Response(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            }
        });
    } catch (error) {
        console.error('Prerender error:', error);
        // 에러 시 홈으로
        return Response.redirect('https://piper-trail.com');
    }
}