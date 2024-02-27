import styled from "styled-components"
import { Col, Image } from "../../bootstrap"
import styles from "./BasicsOfTestimonyCard.module.css"
import { TestimonyCard, TestimonyCardContent, TestimonyCardTitle } from "../StyledTestimonyComponents"

export type BasicsOfTestimonyCardProps = {
  title: string
  index: number
  alt: string
  paragraph: string
  src: string
}

const TestimonyWordBubble = styled(Col)`
  width: 20rem;
  display: flex;
  align-items: center;
  @media (max-width: 48em) {
    width: 50%;
    margin: 0 25%;
    transform: translate(0, 2rem);
  }
`
const WordBubbleImage = ({alignLeft, className, src, alt} : {alignLeft: boolean, className?: string, src: string, alt: string}) => {
  return (
    <Image className={className} fluid src={src} alt={alt} />
  )
}
const StyledWordBubbleImage = styled(WordBubbleImage)`
  transform: ${props => props.alignLeft ? 'translate(2rem)' : 'translate(-2rem)'}
`

const BasicsOfTestimonyCard = ({ title, index, alt, paragraph, src }: BasicsOfTestimonyCardProps) => {
  return (
    <TestimonyCard>
      <TestimonyWordBubble
        md={6}
        lg={{ order: index % 2 == 0 ? 0 : 5 }}
      >
        <StyledWordBubbleImage
          alignLeft={index % 2 == 0}
          alt={alt}
          src={src}
        />
      </TestimonyWordBubble>
      <Col
        className={index % 2 == 0 ? styles.textRight : styles.textLeft}
        lg={{ order: 3 }}
      >
        <TestimonyCardTitle className={`mb-3`}>{title}</TestimonyCardTitle>
        <TestimonyCardContent>{paragraph}</TestimonyCardContent>
      </Col>
    </TestimonyCard>
  )
}

export default BasicsOfTestimonyCard
