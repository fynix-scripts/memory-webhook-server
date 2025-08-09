const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const app = express()
const port = process.env.PORT || 3000

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1403775411522895962/rypjFWsg1JgrQIl8HwKgfeqx3HEAN6cI8C2VsUhBd2XYE4xrfBLbNMKeR73b7WR8VVG_'

app.use(express.static(__dirname))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/callback.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'callback.html'))
})

app.post('/send-application', async (req, res) => {
  const data = req.body

  const fields = Object.entries(data).map(([key, value]) => {
    let fieldName = key

    const questions = {
      navn: "Dit fulde navn",
      discord: "Discord brugernavn",
      alder: "Alder",
      aktivitet: "Hvor meget staff aktivitet kan vi forvente af dig om ugen?",
      om: "Lidt om dig selv? (Hvordan du er som person)",
      regler: "Beskriv 5 valgfrie regler, med hvad de betyder og gerne nogle eksempler på dem.",
      hvorfor: "Hvorfor vil du gerne være staff? (100+ ord)",
      kompetencer: "Hvilke erfaringer samt kompetencer har du? nævn gerne server og rank:",
      bidrag: "Hvad er dine styrker, og hvad kan du bidrage med?",
      vdm: "Du ser en der laver vdm, hvad gør du?",
      scene: "Du er i scenarie med en, der begynder at bryde sin fearrp, hvad gør du?",
      modder: "Der er mistanke om modder på serveren, fra flere spillere og ting der sker på serveren.. Hvad gør du?",
      spørg: "Er du indforstået ved, hvis du spørger ind til din ansøgning, bliver den afvist? Ja/Nej"
    }

    const name = questions[key] || key
    return { name, value: value || 'Ikke udfyldt' }
  })

  const embed = {
    embeds: [{
      title: "Ny ansøgning modtaget",
      color: 3447003,
      fields,
      timestamp: new Date().toISOString()
    }]
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    })

    if (!response.ok) throw new Error('Webhook fejlede')
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server kører på http://localhost:${port}`)
})