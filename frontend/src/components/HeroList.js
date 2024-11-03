import { Col, Pagination, Row, Container } from "react-bootstrap";
import { HeroItem } from "./HeroItem";
import useHeroStore from "../stores/heroStore";

export const HeroList = ({heroes, meta}) => {
  const {fetchHeroes} = useHeroStore();
  return (
    <div>
      <Container>
        <Row>
        {heroes.map(hero => (
            <Col key={hero.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <HeroItem  hero={hero}/>
            </Col>
        ))}
        </Row>
      </Container>

      <Pagination>
        <Pagination.First disabled={meta.currentPage === 1} onClick={() => fetchHeroes(1, 5)} />
        <Pagination.Prev disabled={!meta.isTherePrevPage} onClick={() => fetchHeroes(meta.currentPage - 1, 5)}/>
        <Pagination.Item active>{meta.currentPage}</Pagination.Item>
        <Pagination.Next disabled={!meta.isThereNextPage} onClick={() => fetchHeroes(meta.currentPage + 1, 5)}/>
        <Pagination.Last disabled={meta.currentPage === meta.totalPages} onClick={() => fetchHeroes(meta.totalPages, 5)}/>
      </Pagination>
    </div>
  )
}