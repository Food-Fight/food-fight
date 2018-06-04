import React from 'react';

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title is-primary">Hello World</h1>
          <div className="block">
            <a href="" className="button is-primary">
              Button
            </a>
          </div>
          <p className="subtitle is-primary">
            My first website with <strong>Bulma</strong>!
          </p>
        </div>
      </section>
    );
  }
}
export default Title;
