export const metaTagsConfigurations = () => {
    if (process.env.NODE_ENV === 'production') {
        document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index, follow')
        document.querySelector('meta[name="revisit-after"]')?.setAttribute('content', '1 day')
        document.querySelector('meta[name="googlebot"]')?.setAttribute('content', 'index, follow')
    }
    else {
        document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow')
        document.querySelector('meta[name="revisit-after"]')?.setAttribute('content', '1 hour')
        document.querySelector('meta[name="googlebot"]')?.setAttribute('content', 'noindex, nofollow')
    }
}