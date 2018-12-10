import styles from './index.css';

import { Component } from 'react';
import withRouter from 'umi/withRouter';

class BasicLayout extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {pathname} = this.props.location;

    switch (pathname){
      case '/login':
        return this.props.children;
      default:
        return this.props.children;

    }
  }
}

export default withRouter(BasicLayout);