# Kokoushuoneiden varaus API

Yksinkertainen REST-rajapinta kokoushuoneiden varaamiseen.

Projektissa on hyödynnetty tekoälyä (Cursor) parikoodaajana. Alkuperäinen AI:n tuottama ratkaisu on refaktoroitu vaiheittain keskittyen:
- rakenteen selkeyttämiseen
- domain-logiikan erottamiseen
- virheenkäsittelyn yhtenäistämiseen
- tietoturvan ja ylläpidettävyyden parantamiseen

### Ominaisuudet
- Varauksen luonti tietylle aikavälille
- Varauksen peruutus (omat varaukset)
- Huonekohtaisten varausten listaus

### Teknologiat
- TypeScript
- Fastify
- JSON Schema -validointi
- muistinvarainen tietokanta

### Projektin rakenne

```
src/
├── domain/ - Toimintalogiikka
├── handlers/ - Reittien käsittelijät
├── routes/ - HTTP-reittien määrittely
├── schemas/ - JSON Schema -validointi
├── storage/ - Muistinvarainen tietokanta
├── server.ts - Sovelluksen käynnistys
```

### Käynnistys
```
npm install
npm run dev
```

**Luo varaus**
```
POST /reservations
Headers:
 x-user-id: user-1

Body:
{
 "roomId": "room-1",
 "startTime": "2026-03-01T11:00:00:000Z",
 "endTime": "2026-03-01T12:00:00:000Z"
}
```

**Poista varaus**
```
DELETE /reservations/{id}
Headers:
 x-user-id: user-1
```

**Listaa huoneen varaukset**
```
GET /rooms/{roomId}/reservations
```

**Huoneet**

Järjestelmässä on ennalta määritetty joukko huoneita:
- room-1
- room-2
- room-3
- room-4

Varauksen voi tehdä vain olemassa olevaan huoneeseen.

**Aikakäsittely**

Backend käsittelee ajat UTC-ajassa ISO 8601-muodossa.

**Autentikointi**

Autentikointi on simuloitu x-user-id headerin avulla. Käyttäjä voi perua vain omia varauksiaan.

**Testaus**

APIa on testattu manuaalisesti VS Coden REST Client laajennuksella. Testipyynnöt on määritelty requests.http tiedostossa.

