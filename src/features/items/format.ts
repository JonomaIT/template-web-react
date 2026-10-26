const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

export const shortId = (id: string) => id.slice(0, 8);
