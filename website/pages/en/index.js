/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner index-info-block grid-blocks two-blocks-grid">
          <div 
          className="index-info-block-title">
            Create conditional tokens: a new asset class with rich informational capabilities, making the outcome of any future event tradable.
          </div>
          <div className="index-info-block-text">
            <p>
            The conditional tokens developer portal aims to provide an overview of the open framework.</p> 
            <p>It’s a place where you can explore different use cases for conditional tokens, as well as detailed tutorials on how to encode conditionality and liquidity into your own dapps and prediction markets.
            </p>
          </div>
        </div>

        <div className="inner index-section-boxes grid-blocks four-blocks-grid">
          <a href={docUrl("introduction1")} className="white-box">
            <h3>
              Introduction
            </h3>
            <p>
              A <strong>short primer</strong> on Conditional Tokens
            </p>
          </a>
          <a href="/use-case" className="white-box">
            <h3>
              Use Cases
            </h3>
            <p>
              Explore the <strong>versatility</strong> of Conditional Tokens
            </p>
          </a>
          <a href={docUrl("devguide01")} className="white-box">
            <h3>
              Documentation
            </h3>
            <p>
              <strong>Deep dive</strong> into the Conditional Tokens contracts
            </p>
          </a>
          <a href="/tutorials" className="white-box">
            <h3>
              Tutorials
            </h3>
            <p>
              <strong>Get started</strong> and build your Conditional Token Dapp
            </p>
          </a>
        </div>

        <div className="inner index-section-last-boxes grid-blocks two-blocks-grid">
          <a href="/#support" className="white-box">
            <h3>
              Support
            </h3>
            <p>
              Need some <strong>help</strong>? Reach out to us!
            </p>
          </a>

          <a href="/#projects" className="white-box">
            <h3>
              Projects
            </h3>
            <p>
              <strong>Explore</strong> existing Conditional Token applications
            </p>
          </a>
        </div>

        <div className="inner index-what-are grid-blocks two-blocks-grid">
          <div>
            <h2>
              What are <br></br>Conditional Tokens?
            </h2>
          </div>
          <div>
          <p> Gnosis has developed the conditional tokens open framework. Conditional tokens are an application agnostic, new asset class designed to facilitate the creation of highly liquid prediction markets. Conditional tokens enable combinatorial outcomes for higher resolution information discovery through prediction markets.</p>
<p>
The conditional tokens framework allows you to:
</p>
<p>
<ul>
  <li> Make simple markets on the likelihood of a given event.</li>
  <li> Make complex markets about how the likelihood of an event is affected by any other event.</li>
  <li> Trade any asset under the condition that a specific event occurs.</li>
</ul>
</p>
<p>
Prediction markets are the main use case for conditional tokens, which the Sight prediction market platform and other Gnosis Ecosystem projects build on. Conditional tokens have a wide range of additional use cases, from awarding access rights in games to paying milestone-based and social impact bonds. </p>

          </div>
        </div>

        <div className="inner index-advantages grid-blocks two-blocks-grid">
          <div>
            <h2>
              Advantages of <br></br>Conditional Tokens
            </h2>
          </div>
          <div className="index-advantages-boxes  grid-blocks two-blocks-grid">
            <a href="" className="white-box">
              <h3>
                Deeper Combinatorial Markets
              </h3>
              <p>
              Enabling <strong>deeper information discovery</strong>  in respect to conditional probabilities of events.

              </p>
            </a>

            <a href="" className="white-box">
              <h3>
               Oracle Agnostic
              </h3>
              <p>
                Work with the <strong>right oracle for the right question protocol</strong> is not tied to any specific oracle.
             
              </p>
            </a>

            <a href="" className="white-box">
              <h3>
                ERC 1155 tokens
              </h3>
              <p>
               Allow batch transfers and receiver callbacks and <strong> avoid costly outcome token deployments</strong> for new events. 
              </p>
            </a>

            <a href="" className="white-box">
              <h3>
                Audited contracts
              </h3>
              <p>
                Cut costs on development <strong>without sacrificing security</strong>. 
              </p>
            </a>
          </div>
        </div>

        <div className="inner index-projects-using grid-blocks two-blocks-grid">
          <div>
           <a name="projects">
            <h2>
              Projects using<br></br>Conditional Tokens
            </h2>
            </a>
            <p>
              Conditional Tokens are already used by those projects.
            </p>

          </div>
          <div className="index-projects-boxes grid-blocks three-blocks-grid">
            <a href="" className="white-box background-color-1">
              P1
            </a>
            
            <a href="" className="white-box background-color-2">
              P2
            </a>
          
            <a href="" className="white-box background-color-3">
              P3
            </a>

            <a href="" className="white-box background-color-4">
              P4
            </a>
            
            <a href="" className="white-box background-color-5">
              P5
            </a>
          
            <a href="" className="white-box background-color-6">
              P6
            </a>
          </div>
        </div>

        <div className="inner index-support grid-blocks two-blocks-grid">
          <div>
            <a name="support">
              <h2>
                Support<br></br>and Community
              </h2>
            </a>
            <p>
              Reach out to us!
            </p>
          </div>
          <div className="index-support-boxes grid-blocks">
            <a href="">
                Schedule a call with Gnosis
                <i className="icon icon-arrow"></i>
            
            </a>
            
            <a href="">
                Chat with us on discord
                <i className="icon icon-arrow"></i>
              
            </a>
          
            <a href="">
                Dev Focus Forum
                <i className="icon icon-arrow"></i>
            </a>
          </div>
        </div>


      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );


    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
        </div>
      </div>
    );
  }
}

module.exports = Index;
