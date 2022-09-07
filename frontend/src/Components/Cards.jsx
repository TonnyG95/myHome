import React, {useEffect, useState} from 'react'
import { Container, Card, Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Axios from 'axios'


import myListings from './Assets/Data/Dummydata'

function Cards() {

  const [allListings, setAllListings] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true)
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Show on map
    </Tooltip>
  );

  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function GetAllListings() {
      try {
        const response = await Axios.get('https://8000-tonnyg95-myhome-2864quj0ulx.ws-eu63.gitpod.io/api/listings/', {cancelToken: source.token})
        setAllListings(response.data)
        setDataIsLoading(false) 
      } catch(error){
        console.log(error.response)
      }
    }
    GetAllListings();
    return ()=>{
      source.cancel();
    }
  },[])
 
  if (dataIsLoading === false ){
    console.log(allListings)
  }

  if (dataIsLoading === true ){
    return  <div className="container text-center my-5 p-4"> <Spinner animation="border" /></div>;
  }

  return (
    <Container>
      <h3 className='listings-text'>Listings</h3>
      {allListings.map((listing)=>{
          return (
            <Card
              className=" bg-dark2 text-light mb-2 py-3"
              key={listing.id}
              style={{ width: "100%", margin: "auto", color: "#212529" }}
            >
              <Card.Img
                variant="top"
                src={listing.picture1}
                alt={listing.title}
              />
              <Card.Body>
                <Card.Title>{listing.title}</Card.Title>
                <Card.Text>
                  {listing.description.substring(0, 150)}...
                </Card.Text>

                {listing.property_status === "Sale" ? (
                  <Card.Text className="text-center">
                    <h5>
                      Price:{" "}
                      {listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      €
                    </h5>
                  </Card.Text>
                ) : (
                  <Card.Text className="text-center">
                    <h5>
                      Price:{" "}
                      {listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      € / {listing.rental_frequency}
                    </h5>
                  </Card.Text>
                )}

                <Button variant="primary">Details</Button>

                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <Button className='mx-3' variant="primary">
                    <i class="fa-solid fa-location-dot"></i>
                  </Button>
                </OverlayTrigger>
              </Card.Body>
            </Card>
          );
        })}
      
    </Container>
  )
}

export default Cards