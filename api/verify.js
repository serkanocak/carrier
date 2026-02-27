export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Missing token' });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
        return res.status(500).json({ message: 'Missing server configuration' });
    }

    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
            { method: 'POST' }
        );
        const data = await response.json();

        // Score is between 0.0 (bot) and 1.0 (human)
        if (data.success && data.score >= 0.5) {
            return res.status(200).json({ success: true, score: data.score });
        } else {
            return res.status(403).json({
                success: false,
                message: 'reCAPTCHA verification failed. Bot traffic detected.'
            });
        }
    } catch (error) {
        // Fallback error
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
