    // Event listeners with proper type checking
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        userData.behavior.actions.clicks.push({
            timestamp: new Date().toISOString(),
            x: event.clientX,
            y: event.clientY,
            target: target?.tagName || 'unknown',
            id: target?.id || null
        });
    });

    document.addEventListener('scroll', (() => {
        let timeout: ReturnType<typeof setTimeout>;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                userData.behavior.actions.scrolls.push({
                    timestamp: new Date().toISOString(),
                    scrollX: window.scrollX,
                    scrollY: window.scrollY,
                    maxScroll: Math.max(
                        document.body.scrollHeight,
                        document.documentElement.scrollHeight
                    )
                });
            }, 150);
        };
    })());

    // Track page navigation
    window.addEventListener('popstate', () => {
        userData.behavior.session.navigation.push({
            timestamp: new Date().toISOString(),
            from: document.referrer,
            to: window.location.href,
            type: 'navigation'
        });
    });

    // Form submission tracking
    document.addEventListener('submit', (event: SubmitEvent) => {
        const target = event.target as HTMLFormElement;
        const formId = target?.id || 'unnamed_form';
        userData.behavior.actions.forms[formId] = {
            timestamp: new Date().toISOString(),
            fields: Array.from(target.elements)
                .filter((element): element is HTMLInputElement =>
                    element instanceof HTMLInputElement && element.type !== 'password'
                )
                .map(element => ({
                    type: element.type || 'unknown',
                    name: element.name || 'unnamed',
                    filled: !!element.value
                }))
        };
    });