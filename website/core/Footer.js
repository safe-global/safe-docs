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
            <a href={this.docUrl('doc1.html', this.props.language)}>
              Imprint
            </a>
            <a href={this.docUrl('game1.html', this.props.language)}>
              Copyright
            </a>
            <a href={this.docUrl('doc3.html', this.props.language)}>
             © 2020 Gnosis LTD
            </a>
          </div>
          <div>
            <h5>Docs</h5>
            <a href={this.pageUrl('users.html', this.props.language)}>
              Getting Started
            </a>
            <a href={this.pageUrl('users.html', this.props.language)}>
              Guides
            </a>
            <a href={this.pageUrl('users.html', this.props.language)}>
              Olympia
            </a>
            <a href="https://discordapp.com/">Project Chat</a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://blog.gnosis.pm">Blog</a>
            <a href="https://github.com/">GitHub</a>
            <a
              className="github-button"
              href="https://github.com/gnosis/gnosis-docs/"
              data-icon="octicon-star"
              data-count-href="/gnosis/gnosis-docs/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
              <span className="icon icon-star"></span>
            </a>
            {/* <a
              className="bordered-button"
              href="https://github.com/gnosis/gnosis-docs/">
              Star
              <span className="icon icon-star"></span>
            </a> */}
          </div>

          <div>
            <h5>Community</h5>
            <a href="https://blog.gnosis.pm">User Showcase</a>
            <a href="https://github.com/">Stack Overflow</a>
            <a href="https://github.com/">Project Chat</a>
          </div>

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
