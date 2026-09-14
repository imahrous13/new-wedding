export const weddingData = {
  bride: "Rim",
  groom: "Abdelrahman",
  date: "October 22, 2026",
  dateISO: "2026-10-22T00:00:00+03:00",
  time: "",
  venue: "Madar Venue",
  address: "Tolip Gardens Hotel, Nasr City",
  mapsUrl: "https://maps.app.goo.gl/FXkeLXh4vSudiEVY8?g_st=ic",
  rsvpName: "",
  rsvpPhone: "",
  rsvpDeadline: "",
  website: "",
  initials: "AR",
  song: {
    title: "أنا لك على طول",
    artist: "عبد الحليم حافظ",
    youtubeId: "pSr0NwkmpMY",
    startSeconds: 52,
  },
} as const;

export type WeddingData = typeof weddingData;

export function getInitials(data: WeddingData = weddingData) {
  if (data.initials?.length >= 2) {
    return {
      first: data.initials[0],
      second: data.initials[1],
    };
  }

  return {
    first: data.bride.charAt(0),
    second: data.groom.charAt(0),
  };
}
