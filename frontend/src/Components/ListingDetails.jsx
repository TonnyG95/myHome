import React, { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Button,
  Container,
  Spinner,

} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

// Contexts
import StateContext from "../Contexts/StateContext";



function ListingDetails() {


  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const params = useParams();

  const initialState = {
    dataIsLoading: true,
    listingInfo: "",
    sellerProfileInfo: "",
  };

  function ReducerFuction(draft, action) {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "catchListingInfo":
        draft.listingInfo = action.listingObject;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;

        case "catchSellerProfileInfo":
          draft.sellerProfileInfo = action.profileObject;
          break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

  useEffect(() => {
    async function GetPListingInfo() {
      try {
        const response = await Axios.get(
          `https://8000-tonnyg95-myhome-2864quj0ulx.ws-eu64.gitpod.io/api/listings/${params.id}/`
        );

        dispatch({
          type: "catchListingInfo",
          listingObject: response.data,
        });
        
      } catch (e) {}
    }
    GetPListingInfo();
  }, []);


  // Get User Info

  useEffect(() => {
		if (state.listingInfo) {
			async function GetProfileInfo() {
				try {
					const response = await Axios.get(
						`https://8000-tonnyg95-myhome-2864quj0ulx.ws-eu64.gitpod.io/api/profiles/${state.listingInfo.seller}/`
					);

					dispatch({
						type: "catchSellerProfileInfo",
						profileObject: response.data,
					});
					dispatch({ type: "loadingDone" });
				} catch (e) {}
			}
			GetProfileInfo();
		}
	}, [state.listingInfo]);


  

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture)=> picture !== null);

  const [currentPicture, setCurrentPicture] = useState(0);

  function NextPicture() {
		if (currentPicture === listingPictures.length - 1) {
			return setCurrentPicture(0);
		} else {
			return setCurrentPicture(currentPicture + 1);
		}
	}

	function PreviousPicture() {
		if (currentPicture === 0) {
			return setCurrentPicture(listingPictures.length - 1);
		} else {
			return setCurrentPicture(currentPicture - 1);
		}
	}

  const date = new Date(state.listingInfo.date_posted);
	const formattedDate = `${
		date.getDate() + 1
	}/${date.getMonth()}/${date.getFullYear()}`;


  if (state.dataIsLoading === true) {
      return (
        <div className="container text-center my-5 p-4">
          <Spinner animation="border" />
        </div>
      );
  }

  return (
    <div>
      <Row className="text-center">
        <Col
          className="bg-dark text-light text-center py-5"
          xs={12}
          md={5}
          lg={5}
          xl={5}
        >
          <h5>Seller Details</h5>

          <Container>
            <h5 className="text-center">
              {state.sellerProfileInfo.agency_name}
            </h5>

            <img
              className="rounded my-4 placeholed-image"
              src={
                state.sellerProfileInfo.profile_picture
                  ? state.sellerProfileInfo.profile_picture
                  : "https://res.cloudinary.com/dsq1kzjdy/image/upload/v1662651727/media/No-Image-Placeholder.svg_bgopvn.png"
              }
              alt="test"
            />

            <h5 className="text-center my-4">Information:</h5>

            <Row className="mt-5">
              <Col xs={6} sm={6} md={6} lg={6} className="p-1">
                <h6 className="text-center my-4">Agency Name:</h6>
                <h6 className="text-center my-4">Phone Number:</h6>
                <h6 className="text-center my-4">Listings:</h6>
              </Col>

              <Col xs={6} sm={6} md={6} lg={6} className="p-1">
                <h6 className="text-center my-4">
                  {state.sellerProfileInfo.agency_name}
                </h6>
                <h6 className="text-center my-4">
                  {state.sellerProfileInfo.phone_number}
                </h6>
                <h6
                  onClick={() =>
                    navigate(`/agencies/${state.sellerProfileInfo.seller}`)
                  }
                  className="text-center m-4 navigate-link"
                >
                  Check other listings
                </h6>
              </Col>
            </Row>

            <Row>
              <h6 className="text-center my-4">About Agency:</h6>
            </Row>

            <Row>
              <h6 className="text-center my-4">
                {state.sellerProfileInfo.bio}
              </h6>
            </Row>
          </Container>
        </Col>

        <Col
          className="bg-light py-5 text-center listings-scroll"
          xs={12}
          md={7}
          lg={7}
          xl={7}
        >
          <h1 className="my-4 text-muted">{state.listingInfo.title}</h1>

          {listingPictures.map((picture, index) => {
            return (
              <div key={index}>
                {index === currentPicture ? (
                  <img
                    className="img-fluid rounded"
                    src={picture}
                    alt={state.listingInfo.title}
                  />
                ) : (
                  ""
                )}
              </div>
            );
          })}

          <div className="my-3">
            <span onClick={PreviousPicture}>
              {" "}
              <i class="slider-icons mx-2 w-25 h-25 fa-solid fa-circle-arrow-left"></i>
            </span>
            Picture: {currentPicture}
            <span onClick={NextPicture}>
              {" "}
              <i class="slider-icons mx-2 w-25 h-25 fa-solid fa-circle-arrow-right"></i>
            </span>
          </div>

          <Row className="box-content text-center mt-3">
            <Col className="mt-3 text-muted" xs={12} md={4} lg={4} xl={4}>
              <h5>Town: {state.listingInfo.town}</h5>
              <h5>Rooms: {state.listingInfo.rooms}</h5>
              <h5>Posted: {formattedDate}</h5>
            </Col>

            <Col className="mt-3 text-muted" xs={12} md={4} lg={4} xl={4}>
              <h5>Listing Type: {state.listingInfo.listing_type}</h5>
              <h5>Property Status: {state.listingInfo.property_status}</h5>
              <h5>
                Price: €
                {state.listingInfo.property_status === "Sale"
                  ? state.listingInfo.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : `${state.listingInfo.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / ${
                      state.listingInfo.rental_frequency
                    }`}
              </h5>
            </Col>

            <Col className="mt-3 text-muted">
              {state.listingInfo.furnished ? (
                <h5>
                  Furnished: <i class="bi bi-check2-square"></i>
                </h5>
              ) : (
                ""
              )}
              {state.listingInfo.pool ? (
                <h5>
                  Pool: <i class="bi bi-check2-square"></i>
                </h5>
              ) : (
                ""
              )}
              {state.listingInfo.elevator ? (
                <h5>
                  Elevator: <i class="bi bi-check2-square"></i>
                </h5>
              ) : (
                ""
              )}
              {state.listingInfo.cctv ? (
                <h5>
                  CCTV: <i class="bi bi-check2-square"></i>
                </h5>
              ) : (
                ""
              )}
              {state.listingInfo.parking ? (
                <h5>
                  Parking: <i class="bi bi-check2-square"></i>
                </h5>
              ) : (
                ""
              )}
            </Col>
          </Row>

          <h5 className="my-4">Description</h5>
          <h6 className="my-4 box-content text-muted text-center">
            {state.listingInfo.description}
          </h6>


          

          
        </Col>
      </Row>
    </div>
  );
}

export default ListingDetails;
