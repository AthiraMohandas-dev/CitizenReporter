function generateMailto(email, subject, body) {

    if (!email) return null;

    const mailto =
        `mailto:${email}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

    return mailto;
}

module.exports = {
    generateMailto
};