import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import profileImage from "../../assets/upgrad.svg";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import CardMedia from "@material-ui/core/CardMedia";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLable from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";


const styles = (theme) => ({
    // Root css
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    //Grid css
    grid: {
      padding: "20px",
      "margin-left": "10%",
      "margin-right": "10%",
    },
    card: {
      maxWidth: "100%",
    },
    //media css
    media: {
      height: 0,
      paddingTop: "56.25%",
    },
    //Avatar card css
    avatar: {
      margin: 10,
      width: 60,
      height: 60,
    },
    //Title card css
    title: {
      "font-weight": "600",
    },
    likeButton: {
      "padding-left": "0px",
    },
    //Add Bitton css
    addCommentBtn: {
      "margin-left": "15px",
    },
  
    //Comment box css
    comment: {
      "flex-direction": "row",
      "margin-top": "25px",
      "align-items": "baseline",
      "justify-content": "center",
    },
    commentUsername: {
      fontSize: "inherit",
    },
  });

class Home extends Component {
    constructor() {
        super();
        this.state = {
          isLogin: sessionStorage.getItem("access_token") === null ? false : true,
          access_token: sessionStorage.getItem("access_token"),
          user_id: sessionStorage.getItem("user_id"),
          images: [],
          comments: [],
          comment: "",
          commentCount: 1,
          searchOn: false,
          originalimageData: {},
        };
      }
      //Random number generator for likes
      randomLikeGenerator() {
        return Math.floor(Math.random() * 10) + 1;
      }
      //Called Immediately after component mounted
      componentDidMount() {
        let scope = this;
        if (this.state.isLogin) {
          let userUrl =
            this.props.baseUrl + this.state.user_id + "?fields=media_count,username&access_token=" +this.state.access_token;
          fetch(userUrl, {
             method: "GET",
          })
            .then((response) => {
              return response.json();
            })
            .then((jsonResponse) => {
              scope.setState({
                media_count: jsonResponse.media_count,
                username: jsonResponse.username,
              });
            })
            .catch((error) => {
              console.log("error user data", error);
            });
        }
    
        if (this.state.isLogin) {
          let url =
            this.props.baseUrl +
            "me/media?fields=id,caption&access_token=" +
            this.state.access_token;
          fetch(url, {
            method: "GET",
          })
            .then((response) => {
              return response.json();
            })
            .then((jsonResponse) => {
              let imageData = jsonResponse.data;
              imageData.forEach((imageElement) => {
                let created_time = new Date(imageElement.timestamp)
                  .toLocaleString()
                  .split(",");
                imageElement.timestamp = created_time;
                let likes = scope.randomLikeGenerator();
                imageElement.likes = likes;
                imageElement.caption = imageElement.caption.split("\n");
                let isLiked = false;
                imageElement.isLiked = isLiked;
              });
              scope.setState({
                images: imageData,
              });
            })
            .catch((error) => {
              console.log("error user data", error);
            });
        }
      }
    
      //Like button handler
      likeBtnHandler = (imageId) => {
        let imageData = this.state.images;
        for (let i = 0; i < imageData.length; i++) {
          if (imageData[i].id === imageId) {
            if (imageData[i].isLiked === true) {
              imageData[i].isLiked = false;
              imageData[i].likes--;
              this.setState({
                images: imageData,
              });
              break;
            } else {
              imageData[i].isLiked = true;
              imageData[i].likes++;
              this.setState({
                images: imageData,
              });
              break;
            }
          }
        }
      };
    
      commentTextChangeHandler = (event, imageId) => {
        let comment = {
          id: imageId,
          commentText: event.target.value,
        };
        this.setState({
          comment,
        });
      };

       //Caption search Handler
       captionSearchHandler = (keyword) => {
        if (!(keyword === "")) {
          let originalimageData = [];
          this.state.searchOn
            ? (originalimageData = this.state.originalimageData)
            : (originalimageData = this.state.images);
          let updatedimageData = [];
          var searchOn = true;
          keyword = keyword.toLowerCase();
          originalimageData.forEach((image) => {
            let caption = image.caption[0].toLowerCase();
            if (caption.includes(keyword)) {
              updatedimageData.push(image);
            }
          });
          if (!this.state.searchOn) {
            this.setState({
              searchOn,
              images: updatedimageData,
              originalimageData,
            });
          } else {
            this.setState({
              images: updatedimageData,
            });
          }
        } else {
          searchOn = false;
          this.setState({
            searchOn,
            images: this.state.originalimageData,
            originalimageData: [],
          });
        }
      };

      //Add Comment Handler
      addCommentHandler = () => {
        let count = this.state.commentCount;
        let comment = {
          id: count,
          imageId: this.state.comment.id,
          username: this.state.username,
          commentText: this.state.comment.commentText,
        };
        count++;
        let comments = [...this.state.comments, comment];
        this.setState({
          comments,
          commentCount: count,
          comment: "",
        });
      };
    
         
    render() {
        const { classes } = this.props;
        return (
            <div>
              <Header
          showSearchBox={this.state.isLogin ? true : false}
          showProfileIcon={this.state.isLogin ? true : false}
          showMyAccount={this.state.isLogin ? true : false}
          captionSearchHandler={this.captionSearchHandler}
        />
          <div className="flex-container">
          <Grid
            container
            spacing={3}
            wrap="wrap"
            alignContent="center"
            className={classes.grid}
          >
            {this.state.images.map((image) => (
              <Grid key={image.id} item xs={12} sm={6} className="grid-item">
                <Card className={classes.card}>
                  <CardHeader
                    classes={{
                      title: classes.title,
                    }}
                    avatar={<Avatar src={profileImage}></Avatar>}
                    title={this.state.username}
                    subheader={image.timestamp}
                    className={classes.cardheader}
                  ></CardHeader>
                  <CardMedia
                    image={image.media_url}
                    className={classes.media}
                  ></CardMedia>
                  <CardContent>
                    <div className="horizontal-rule"></div>

                    <div className="image-caption">{image.caption[0]}</div>
                    <div className="image-hashtags">{image.caption[1]}</div>
                    <IconButton
                      className={classes.likeButton}
                      aria-label="like-button"
                      onClick={() => this.likeBtnHandler(image.id)}
                    >
                      {image.isLiked ? (
                        <FavoriteIcon
                          fontSize="large"
                          style={{ color: "red" }}
                        ></FavoriteIcon>
                      ) : (
                        <FavoriteBorderIcon fontSize="large"></FavoriteBorderIcon>
                      )}
                    </IconButton>

                    {image.likes === 1 ? (
                      <span className="like-count">{image.likes} like</span>
                    ) : (
                      <span className="like-count">{image.likes} likes</span>
                    )}

                    {this.state.comments.map((comment) =>
                      image.id === comment.imageId ? (
                        <div
                          className="comment-display"
                          key={"comment" + comment.id}
                        >
                          <Typography
                            variant="subtitle2"
                            className={classes.commentUsername}
                            gutterbottom="true"
                          >
                            {comment.username}:
                          </Typography>
                          <Typography
                            variant="body1"
                            className="comment-text"
                            gutterbottom="true"
                          >
                            {comment.commentText}
                          </Typography>
                        </div>
                      ) : (
                        ""
                      )
                    )}

                    <FormControl className={classes.comment} fullWidth={true}>
                      <InputLable htmlFor={"Addcomment" + image.id}>
                        Add a comment
                      </InputLable>
                      <Input
                        id={"Addcomment" + image.id}
                        className="comment-text"
                        onChange={(event) =>
                          this.commentTextChangeHandler(event, image.id)
                        }
                        value={
                          image.id === this.state.comment.id
                            ? this.state.comment.commentText
                            : ""
                        }
                      ></Input>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.addCommentBtn}
                        onClick={this.addCommentHandler.bind(this)}
                      >
                        Add
                      </Button>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
