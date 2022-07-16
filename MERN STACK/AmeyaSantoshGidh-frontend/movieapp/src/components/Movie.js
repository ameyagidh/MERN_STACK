import React, {useState,useEffect} from 'react';
import MovieDataService from "../services/movies";
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import {Link, useParams} from 'react-router-dom';
import moment from 'moment';


const Movie = ({user}) =>{

let params = useParams();
const [movie, setMovie] = useState({
    id:null,
    title:"",
    rated:"",
    reviews:[]
});

useEffect(()=>{
    const getMovie = id =>{
        // console.log("debug");
    MovieDataService.get(id)
    .then((response) => {
        console.log(response.data);
        setMovie(response.data)}
    )
    .catch(e => {console.log(e)})
    }
    getMovie(params.id)
},[params.id]);


return(
<div>
<Container>
    <Row>
        <Col>
        <div className='poster'>
            <Image className="bigPicture"
             src = {movie.poster + "/100px250"}
            fluid
            onError={({ currentTarget }) => {      
                currentTarget.src="/images/NoPosterAvailable-crop.jpg";
              }}
            />
        </div>
        </Col>
        <Col>
        <Card>
            <Card.Header as = "h5">
                {movie.title}
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    {movie.plot}
                </Card.Text>
            {user &&
                <Link to = {"/movies/"+params.id+"/review"}>
                    Add Review
                </Link>
            }
            </Card.Body>
        </Card>
        <h2>
            Reviews
        </h2><br></br>
{movie.reviews.map((review,index)=>{
    return(
        <div className="d-flex">
           <div className='flex-shrink-0 reviewsText'>
            <h5>
                {review.name+" reviewed on "}
                {moment(review.date).format("Do MMMM YYYY")}
            </h5>
            <p className='review'>
            {review.review}
            </p>
            {user && user.googleId === review.user_id &&
            <Row>
                <Col>
                <Link to = {{pathname:"/movies/"+params.id+"/review"
                }}
                // editing:true;
                    state ={{
                        currentReview:review
                    }}>
                    Edit
                </Link>
                </Col>
                    <Col>
                    <Button variant = "link" onClick={()=>{
                    //todo
                      var data = {
                        review_id: review._id,
                        user_id: user.googleId
                      }

                      MovieDataService.DeleteReview(data)
                        .then(response => {
                            setMovie((prevState)=>{
                                prevState.reviews.splice(index, 1);
                                return({
                                    ...prevState
                                })
                            })
                        })
                        .catch(e=>{
                            console.log(e);
                        })
                    }}>Delete
                    </Button>
                    </Col>
                </Row>
            }
            </div>     
        </div>
    )
})}  


    </Col>
    </Row>
</Container>

</div>
)
}
export default Movie;




// {movie.reviews.map((review,index)=>{
//     return(
//         <div className="d-flex">
//            <div className='flex-shrink-0 reviewsText'>
//             <h5>
//                 {review.name+"reviewed on"}
//                 {moment(review.date).format("Do MMMM YYYY")}
//             </h5>
//             <p className='review'>
//             {review.review}
//             </p>
//             {user && user.googleId === review.user_id &&
//             <Row>
//                 <Col>
//                 <Link to = {{pathname:"/movies/"+params.id+"/review"
//                 }}
//                     state ={{
//                         currentReview:review
//                     }}>
//                     Edit
//                 </Link>
//                 </Col>
//                     <Col>
//                     <Button variant = "link" onClick={()=>{

//                     }}>Delete
//                     </Button>
//                     </Col>
//                 </Row>
//             }
//             </div>     
//         </div>
//     )
// })}

// </Col>
// </Row>
// </Container>




// {/* change */}
// {movie.reviews.map((review,index)=>{
//     return(
//         <div className="d-flex">
//             <div className="flex-shrink-0 reviewsText">
//                 <h5>{review.name + "reviewed on"}</h5>
//                 <p className="review">
//                     {review.review}
//                 </p>

//             </div>

//         </div>
//     )
// })}