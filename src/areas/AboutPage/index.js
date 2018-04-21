import React from 'react';
import Header from "shared/Header";
import Footer from 'shared/Footer';
import { withRouter } from "react-router-dom";
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';


import './styles.css';

class AboutPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };


  render() {

    return (
      <div className="about-page-container">
        <Header style={{ background: "#fafafa", borderBottom: "1px solid #d4d4d4" }} orgPage={true} />
        <div className="__about-page-content-wrapper">
          <Tabs onChange={this.handleChange}
          value={this.state.slideIndex}
          className="__about-page-tabs">
            <Tab label="What" value={0} />
            <Tab label="Why" value={1} />
            <Tab label="How" value={2} />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <div className="__about-page-tabs-info">
              <h2>What is this site?</h2>
              <p>
                OpenPantry.net is a web application implemented with
    an easy to use React.js based UI that connects donors, organizations
    and those in need. OpenPantry will remain an opensource project
    in hopes that other developers will contribute and add features to
    continue to improve this project.
                </p>
            </div>
            <div className="__about-page-tabs-info">
              <h2>Why did we build this?</h2>
              <p>
                OpenPantry.net's goal is to help nonprofit organizations, donors
    and those in need to make the most efficient use of their
    resources.  With over 330,000 Floridians relying on pantries
    annually it is important to have a database in place to
    track and broadcast available local stock of food and goods.
        </p>
            </div>
            <div className="__about-page-tabs-info">
              <h2>How is this useful?</h2>
              <p>
                OpenPantry.net allows organizations to easily give users
    permission to edit organization tables. Organizations can also set preset
    stock shortage settings to notify donors when stock is critically low.
    Users can easily search inventory, organizations  and events in their area
    to make the best use of their time and find the resources they need most. By
    opening these lines of communication between organizations, donors and those
    in need our hope is that OpenPantry can enhance the lives of everyone involved
    in the process and uplift communities.
        </p>
            </div>
          </SwipeableViews>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(AboutPage);
