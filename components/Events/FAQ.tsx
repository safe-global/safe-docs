import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Add from '@mui/icons-material/Add'
import Minimize from '@mui/icons-material/Minimize'

import Ellipse3 from '../../assets/svg/ellipse-3.svg'
import Ellipse4 from '../../assets/svg/ellipse-4.svg'
import css from './styles.module.css'

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(0)

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : null)
    }

  return (
    <>
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        position='relative'
        zIndex={-1}
      >
        <Ellipse3 style={{ position: 'absolute' }} />
        <Ellipse4 style={{ position: 'absolute', right: 0, top: 100 }} />
      </Grid>
      <Grid container sx={{ maxWidth: '1440px', px: '30px' }}>
        <Grid container justifyContent='space-between'>
          <Grid item width={['100%', '33.3%']}>
            <Typography variant='h2' className={css.heading}>
              FAQ
            </Typography>
          </Grid>
          <Grid item container flexDirection='column' width={['100%', '63%']}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                disableGutters
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{
                  background: 'transparent',
                  boxShadow: 'none',
                  borderBottom: 'solid 1px white',
                  ':last-of-type': {
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    expanded === index ? (
                      <Minimize style={{ marginTop: '-12px' }} />
                    ) : (
                      <Add style={{ width: '24px', height: '24px' }} />
                    )
                  }
                  sx={{ my: 4 }}
                >
                  <Typography variant='h3' className={css.heading3}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    color='text.dark'
                    sx={{ mb: '40px' }}
                    className={css.body}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default FAQ

const faqs = [
  {
    question: 'Who can participate?',
    answer:
      'Anyone with an interest in web3 technologies, blockchain, and decentralized applications can participate. This includes developers, designers, business strategists, and students from all around the world.'
  },
  {
    question: 'How do I register?',
    answer:
      'You can register through the official website linked above. Simply fill out the registration form and join our community channels for updates.'
  },
  {
    question: 'Is there an entry fee to participate?',
    answer: 'No, participation is completely free of charge.'
  },
  {
    question: 'Do I need to have a team to participate?',
    answer:
      'You can participate either as an individual or as part of a team. If you don’t have a team, you can find team members through our community channels and team formation events.'
  },
  {
    question: 'Who can I contact for more information?',
    answer:
      'For any additional questions, please contact us on Discord or directly at our booth during the event. We are here to help!'
  }
]
