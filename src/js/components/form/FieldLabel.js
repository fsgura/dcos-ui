import classNames from 'classnames/dedupe';
import React from 'react';

import {omit} from '../../utils/Util';

const FieldLabel = (props) => {
  let {children, className, matchInputHeight, required} = props;
  let isToggle = false;
  React.Children.forEach(children, (child) => {
    let {props = {}} = child;
    if (['radio', 'checkbox'].includes(props.type)) {
      isToggle = true;
    }
  });
  let classes = classNames(
    {'form-control-toggle form-control-toggle-custom': isToggle},
    className
  );

  let requiredNode;
  if (required) {
    requiredNode = <span className="text-danger"> *</span>;
  }

  let label = (
    <label className={classes}
      {...omit(props, Object.keys(FieldLabel.propTypes))}>
      {children}
      {requiredNode}
    </label>
  );

  if (!matchInputHeight) {
    return label;
  }

  return (
    <div className="form-control-input-height">
      {label}
    </div>
  );
};

FieldLabel.propTypes = {
  children: React.PropTypes.node,
  // Vertically center the element based on the height of input fields
  matchInputHeight: React.PropTypes.bool,
  // Optional boolean to show a required indicator
  required: React.PropTypes.bool,

  // Classes
  className: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.string
  ])
};

module.exports = FieldLabel;
