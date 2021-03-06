// @flow
import type { SimpleTagPropsT } from '../Base';
import type { IconPropsT } from '../Icon';

import * as React from 'react';
import { Icon } from '../Icon';
import { simpleTag, withRipple } from '../Base';
import { withFoundation, addClass, removeClass } from '../Base/MDCFoundation';

import { MDCChip, MDCChipSet } from '@material/chips/dist/mdc.chips';

/** A chip component. */
export const ChipRoot = withRipple()(
  simpleTag({
    displayName: 'ChipRoot',
    classNames: props => [
      'mdc-chip',
      {
        'mdc-chip--selected': props.selected
      }
    ],
    consumeProps: ['selected']
  })
);

export type ChipPropsT = {
  /** A custom event you can use from MCW. You can also just use onClick instead. */
  onInteraction?: (evt: Event) => mixed,
  /** A custom event for the trailing icon that you can use from MCW. You can also just use onClick instead. */
  onTrailingIconInteraction?: (evt: Event) => mixed,
  /** makes the Chip appear selected. */
  selected?: boolean
} & SimpleTagPropsT;

export class Chip extends withFoundation({
  constructor: MDCChip,
  adapter: {
    addClass: addClass(),
    removeClass: removeClass()
  }
})<ChipPropsT> {
  static displayName = 'Chip';

  render() {
    const {
      onInteraction,
      onTrailingIconInteraction,
      apiRef,
      ...rest
    } = this.props;
    const { root_ } = this.foundationRefs;
    return (
      <ChipRoot
        tabIndex={0}
        {...rest}
        elementRef={root_}
        className={this.classes}
      />
    );
  }
}

/** A checkmark for chip selection and filtering. */
export const ChipCheckmark = () => (
  <div className="mdc-chip__checkmark">
    <svg className="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
      <path
        className="mdc-chip__checkmark-path"
        fill="none"
        stroke="black"
        d="M1.73,12.91 8.1,19.28 22.79,4.59"
      />
    </svg>
  </div>
);

/** Text for a chip. */
export const ChipText = simpleTag({
  displayName: 'ChipText',
  classNames: 'mdc-chip__text'
});

/** Icons inside of a chip. This is an instance of the Icon component. To make the icons interactive, add props tabIndex="0" and role="button". */
export const ChipIconRoot = simpleTag({
  displayName: 'ChipIconRoot',
  tag: Icon,
  defaultProps: {},
  classNames: props => {
    return [
      'mdc-chip__icon',
      {
        'mdc-chip__icon--leading': props.leading,
        'mdc-chip__icon--trailing': props.trailing
      }
    ];
  },
  consumeProps: ['trailing', 'leading']
});

export type ChipIconPropsT = {
  /** Make it a leading icon */
  leading?: boolean,
  /** Make it a trailing icon */
  trailing?: boolean
} & SimpleTagPropsT &
  IconPropsT;
export const ChipIcon = (props: ChipIconPropsT) => {
  const hasInteractionHandler = Object.keys(props).some(p =>
    p.startsWith('on')
  );
  const trailingProps =
    props.trailing || hasInteractionHandler ?
      { role: 'button', tabIndex: 0 } :
      {};

  return <ChipIconRoot {...trailingProps} {...props} />;
};

ChipIcon.displayName = 'ChipIcon';

export const ChipSetRoot = simpleTag({
  displayName: 'ChipSetRoot',
  classNames: props => [
    'mdc-chip-set',
    {
      'mdc-chip-set--choice': props.choice,
      'mdc-chip-set--filter': props.filter
    }
  ],
  consumeProps: ['filter', 'choice']
});

export type ChipSetPropsT = {
  /** Creates a choice chipset */
  choice?: boolean,
  /** Creates a filter chipset */
  filter?: boolean
};

/** A container for multiple Chip components. */
export class ChipSet extends withFoundation({
  constructor: MDCChipSet,
  adapter: {}
})<ChipSetPropsT> {
  render() {
    const { ...rest } = this.props;
    const { root_ } = this.foundationRefs;
    return <ChipSetRoot {...rest} elementRef={root_} />;
  }
}
export type SimpleChipPropsT = {
  /** Text for your Chip */
  text?: React.Node,
  /** Instance of an Icon Component */
  leadingIcon?: React.Node,
  /** Instance of an Icon Component */
  trailingIcon?: React.Node,
  /** Includes a checkmark for the selected state */
  checkmark?: boolean,
  /** Additional children will be rendered in the text area */
  children?: React.Node
};

// handle leading and trailing icons
const renderChipIcon = (iconNode, props) => {
  if (
    (iconNode && typeof iconNode === 'string') ||
    (typeof iconNode === 'object' && iconNode.type !== ChipIcon)
  ) {
    return <ChipIcon use={iconNode} {...props} />;
  }

  return iconNode;
};

/** A non-standard abbreviated way for rendering chips. */
export const SimpleChip = ({
  text,
  leadingIcon,
  trailingIcon,
  checkmark,
  children,
  ...rest
}: SimpleChipPropsT) => (
  <Chip {...rest}>
    {!!leadingIcon && renderChipIcon(leadingIcon, { leading: true })}
    {!!checkmark && <ChipCheckmark />}
    <ChipText>
      {text}
      {children}
    </ChipText>
    {!!trailingIcon && renderChipIcon(trailingIcon, { trailing: true })}
  </Chip>
);

SimpleChip.displayName = 'SimpleChip';
