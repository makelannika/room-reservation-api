# ANALYYSI

## 1. Mitä tekoäly teki hyvin?

- **Perustoiminnallisuus:** AI tuotti heti ensimmäisellä promptilla toimivan ratkaisun joka täytti kaikki API:n perusvaatimukset (varausten luonti/peruutus/katselu).
- **Toimintalogiikka:**  Päällekkäisyyksien, sekä varausten aikarajoitusten tarkistus toimi ohjeistusten mukaisesti.
- **Yksinkertainen tietokanta:** Tietokanta oli vaatimuksiin sopiva, yksinkertainen ja helppo ymmärtää.
- **Virheenkäsittely:** AI hyödynsi järkeviä statuskoodeja virheenkäsittelyssä geneerisen 500 sijaan.
- **Konfiguraatio:** AI alusti projektin, joka oli heti helposti ajettavissa, ilman ylimääräistä konfiguraatiota.

## 2. Mitä tekoäly teki huonosti?

- **Modulaarisuus:** Kaikki logiikka yhdessä tiedostossa.
- **Virheenkäsittely:** AI käsitteli virhetilanteita hajanaisesti palautusarvojen mukaan, mikä toi rakenteeseen toistoa ja raskautta.
- **Koodin selkeys:** Koodi oli pääosin helposti ymmärrettävää, mutta rakenteellinen selkeys puuttui.
- **Syötteen validointi:** Validointi oli rajallista, eikä estänyt esimerkiksi ylimääräisiä tai virheellisiä kenttiä.
- **Varausten suojaus:** Käyttäjät pystyivät poistamaan toistensa varauksia. Käyttäjää ei validoitu eikä userId käyttäjän syöttämänä ollut hyödyllinen.
- **Tietokannan suojaus:** Varausolioita palautettiin suoraan tietokannasta, mikä mahdollisti ei-toivotun ulkopuolisen muokkauksen.  
- **Id-generointi:** Alkuperäinen id-generointi ei ollut luotettava ja olisi voinut johtaa kalliisiin satunnaisiin bugeihin.
- **Päällekkäisyystarkistuksen ylimääräinen monimutkaisuus:** Varausten päällekkäisyyksien tarkistukseen oli lisätty sinne kuulumatonta, ei pyydettyä logiikkaa. `ignoreReservationId`-parametri oli mukana ilman todellista käyttötarvetta.


## 3. Tärkeimmät parannukset tekoälyn koodiin

**Projektin rakenteen selkeyttäminen**

Alkuperäinen server.ts sisälsi reitit, validoinnin, tietokannan ja toimintalogiikan samassa tiedostossa. Vastuiden jakaminen omiin kansioihin ja tiedostoihin helpottaa navigointia, ylläpitoa sekä vastuualueiden hahmottamista.
- **domain/** - toimintalogiikka
- **handlers/** - reittien käsittelijät
- **routes/** - HTTP-reittien määrittely
- **schemas/** - JSON Schema -validointi
- **storage/** - tietokanta
- **server.ts** - sovelluksen käynnistys
  
**Schema-validointi**

Schema-validointi varmistaa syötteen oikeanlaisen muodon ja tyypit tehokkaasti. Sen ansiosta virheelliset pyynnöt hylätään nopeasti, ennen kuin ne koskaan päätyvätkään handlerien käsittelyyn. Schema-validoinnin ansiosta handlerit kevenevät kun validoinnin tarve funktioiden sisällä vähenee. 
  
**Autentikoinnin simulointi**

X-user-id header tuo käyttäjille yksinoikeuden omien varausten perumiseen. 

**Kopioiden palauttaminen storesta**

Varausten kopioiminen ennen palautusta ja tietokantaan lisäystä suojaa varauksia tahattomilta ulkopuolisilta muokkauksilta. 
  
**Virheenkäsittely**

Virheluokat ja mahdollisuus poikkeusten heittämiseen yhtenäistää ja selkeyttää virheenkäsittelyä, sekä kirkastaa handlerien loogista rakennetta. Erilaisten arvojen palautuksen ja niiden tulkitsemisen sijaan poikkeusten heittäminen on helppoa, siistiä ja helposti ymmärrettävää. Virheiden keskitetty käsittely handleError-funktiossa vähentää toistoa catch-lohkoissa ja parantaa luettavuutta. 

## 4. Tehdyt oletukset

**1. Ennalta määritetyt huoneet**

Oletin, että järjestelmässä on ennalta määritetty joukko huoneita, joihin varauksia voi tehdä. Lisäsin yksinkertaisen huonelistan (domain/rooms.ts). Varauksen luominen edellyttää, että varaukseen syötetty huone on olemassa.

**2. Varausten "koskettaminen" sallittu**

Varausten päällekkäisyyksiä ei sallittu, mutta oletin, että varausten aloitus- ja lopetusajat saavat koskettaa toisiaan.
Esim. 
- varaus A päättyy klo. 12:00
- varaus B alkaa klo. 12:00

Tämä on sallittua eikä tulkita päällekkäisyydeksi.

**3. Varausten peruutusoikeus**

Tein oletuksen, että käyttäjät saavat perua vain omia varauksiaan. Vaikka tehtävänannossa mainittiin vain vaadittu toiminnallisuus "varauksen peruutus", pidin tätä realistisena oletuksena varausjärjestelmän järkevyyden kannalta.

**4. Aikojen käsittely UTC-muodossa**

Oletin, että backend käsittelee kaikki ajat UTC-ajassa ja aikojen esittäminen käyttäjälle lokaaliajassa kuuluisi käyttöliittymän vastuulle.

**5. Aukioloaikoja ei rajattu**

Oletin huoneiden olevan varattavissa ympäri vuorokauden.

## 5. Jatkokehitysnäkökulmat

Tunnistettuja, mutta tarkoituksella toteuttamatta jätettyjä mahdollisia kehityskohteita:

- Varausten listaus palauttaa kaikki huoneen varaukset: Käyttäjän näkökulmasta tulevien tai käynnissä olevien varausten suodatus voisi olla oleellisempaa.
- Varausten aikarajoitukset: esim. kuinka pitkälle tulevaisuuteen varauksia voi tehdä sekä varauksen minimi/maksimikesto.
- Menneiden varausten säilytysajan määrittely ja poistaminen tietokannasta x ajan kuluessa.

## 6. Yhteenveto

AI tuotti nopeasti toimivan ja tehtävänannon täyttävän API-ratkaisun, joka toimi hyvänä lähtökohtana. Koodi sisälsi kuitenkin rakenteellisia, laadullisia ja turvallisuuteen liittyviä puutteita. Tehdyt parannukset keskittyivät virheenkäsittelyyn, modulaarisuuteen, validointiin ja tietoturvaan. Näiden parannusten myötä koodista tuli selkeämpää, turvallisempaa ja helpommin ylläpidettävää.



