export const convertDate = (utcDate) => {
        const localDate = new Date(utcDate).toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
        return localDate
    }