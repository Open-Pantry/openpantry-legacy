import React from "react";
import Header from "shared/Header";
import Footer from "shared/Footer";
import {withRouter} from "react-router-dom";
import QuestionBlock from "./components/QuestionBlock";

import "./style.css";

class HelpPage extends React.Component {
  render() {
    return (
      <div className="app-help-page-container">
        <Header style={{background:"#fafafa",borderBottom:"1px solid #d4d4d4"}} orgPage={true} />
        <div className="__help-page-main-wrapper">
          <div className="__help-page-header-container">
              <h1 id= "faq-h1">Frequently Asked Questions</h1>
          </div>
          <div className="__help-page-content-wrapper">
          <h1>General</h1>
          <div className="__help-page-content-block-container">
          <QuestionBlock question="What is OpenPantry?">
              Glad you asked! We are a free service that offers food pantries and other types of assistance organizations a way to 
              keep track of and advertise their supplies and services. 
              You can read more about us <span id="org-faq-aboutLink" className="help-link" onClick={() => this.props.history.push('/about')}>here</span>
            </QuestionBlock>
          <QuestionBlock question="How do I use this site?">
              Use the search bar on the home page to search for specific items, Organizations, events, or keywords.
              <img className="help-gif" src="https://media.giphy.com/media/2aRz3NlK2K6V6iiF4e/giphy.gif" alt="Using the main search page"></img>
            </QuestionBlock>
            <QuestionBlock question="I want to find food pantries near me">
              All search results are ordered by how near they are to you. Click the location button to see a map.
            </QuestionBlock>
            <QuestionBlock question="I want to find a specific organization">
                Type the organization's name into the search bar and press "Enter". Once the results have loaded, click "Organizations".
            </QuestionBlock>
            <QuestionBlock question="I want to find all locations that have a certain item">
                Type the name of the item into the search bar and press "Enter". Once the results have loaded, click "Products". Results will be sorted by how close they are to you.
            </QuestionBlock>
          </div>
          <h1>Organizations</h1>
                    <div className="__help-page-content-block-container">

            <QuestionBlock question="I want to register my organization">
                You can sign your organization up <span id="org-faq-signup" className="help-link" onClick={() => this.props.history.push('/signup')}>here</span>
            </QuestionBlock>
            <QuestionBlock question="I want to update my organization's information.">
                You can edit your profile information on the "My Organization" page by clicking the wrench icon in the box. 
                Enter your address and a description of your organization. You can add
                keyword tags by clicking the plus sign at the bottom left corner of the box. Once you're finished, click the orange save icon to save the changes.
                <img className="help-gif" src="https://media.giphy.com/media/3s8VJQb9vdWfmNy3d7/giphy.gif" alt="Editing profile info"></img>
            </QuestionBlock>
            <QuestionBlock question="I want help working with the inventory.">
                Use the info contained in the volunteer section <a href="#volunteers-h2">here</a>.
            </QuestionBlock>
            <QuestionBlock question="I want to invite volunteers to join.">
                Adding volunteers to your organization will let them add and delete from your inventory. 
                To invite someone as a volunteer click the plus sign in the Members box and use the email form to send them an invitation.
                <img className="help-gif" src="https://media.giphy.com/media/1ajQm0SgB4Of8vrV4F/giphy.gif" alt="Adding a volunteer"></img>
            </QuestionBlock>
            
            <QuestionBlock question="I want to ask donors for donations">
                We do not yet have this feature, but we are working on ways to connect you to your donors.
            </QuestionBlock>
            
            <QuestionBlock question="I want to ask for specific items as donations">
                We do not yet have this feature, but we are working on ways to connect you to your donors.
            </QuestionBlock>
            </div>
          
          <a id="volunteers-h2"><h1>Volunteers</h1></a>
                    <div className="__help-page-content-block-container">

            <QuestionBlock question="I want to sign up as a volunteer">
                OpenPantry is an inventory management tool used by food pantries, so it's just a small part of the 
                incredible work these groups do. If you want to help, contact the organization directly and ask about volunteer opportunities. 
                If you're already
                involved with an organization, ask your coordinator if they need help with inventory management and they can send you
                an invitation to join OpenPantry as their volunteer.  
            </QuestionBlock>
            
            
            <QuestionBlock question="I want to add a new product to the inventory.">
                <p>Use the products box in your organization's profile to change the inventory.</p>
                <p>To add a new item click the plus sign in the top right corner of the Products box. Fill out the form 
                    and click "Submit". Be sure to add tags that describe the product, this will help connect people to the items they need!
                </p>
                <img className="help-gif" src="https://media.giphy.com/media/FeoU8RuSpR7sRyuL0t/giphy.gif" alt="Adding a new product"></img>
                
            </QuestionBlock>
            
            <QuestionBlock question="I want change the amount of a product I have in stock">
            <p>Use the products box in your organization's profile to change the inventory.</p>
            <p>Select the item you want to update by clicking the small wrench next to its current amount. Enter the new amount in the text box
                and click the black save button. To cancel the change click the black "X" button. </p>
                <img className="help-gif" src = "https://media.giphy.com/media/SL7pqjwd6ex7g92NYT/giphy.gif" alt="Update stock amount"></img>
            </QuestionBlock>

            <QuestionBlock question="I want to deactivate my account">
                This is not yet a feature. You are a member for life.
            </QuestionBlock>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(HelpPage);
