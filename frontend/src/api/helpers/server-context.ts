const getCookie = (): string => {
    return document.cookie;
};

// ref: https://stackoverflow.com/a/50735730
const getCookieByFieldName = (name: string): string => {
    let cookieValue = '';
    const cookieString = getCookie();
    if (cookieString && cookieString !== '') {
        const cookies = cookieString.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const getCsrfTokenCookie = (): string => {
    return getCookieByFieldName('csrftoken');
};

class Token {
    private static csrfToken = getCsrfTokenCookie();

    public static getCsrfToken(): string {
        return Token.csrfToken;
    }

    public static refreshCsrfToken(): void {
        Token.csrfToken = getCsrfTokenCookie();
    }
}

export { Token, getCookie };
