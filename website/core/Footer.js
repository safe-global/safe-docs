/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');


class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap grid-blocks six-blocks-grid">
          <div>
            <h5>Gnosis Ltd.</h5>
            <a href={this.docUrl('imprint.html')}>
              Imprint
            </a>
            <a href="https://gnosis.io/">
             Copyright <br></br>
             © 2020 Gnosis LTD
            </a>
          </div>
          <div></div>
          <div> </div>

          <div> </div>

          <div></div>

          <div>
            <a className="icon icon-twitter" href="https://twitter.com/gnosisPM"></a>
            <a className="icon icon-reddit" href="https://reddit.com"></a>
            <a className="icon icon-github" href="https://github.com/gnosis"></a>
            </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
