import useHeroStore from "../stores/heroStore";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export const HeroItem = ({hero}) => {
  const openHeroModal = useHeroStore((state) => state.openHeroModal)

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" style={{
          height: "30vw",
          objectFit: "cover",
        }} src={hero?.images[0]?.url} />
      
      <Card.Body position="bottom">
        <Card.Title>
          {hero.nickname}
        </Card.Title>
        
        <Button variant="primary" onClick={() => openHeroModal(hero)}>
          Details
        </Button>
      </Card.Body>
    </Card>
  )
}
