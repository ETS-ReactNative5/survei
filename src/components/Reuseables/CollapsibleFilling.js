import React from 'react';
import {
    CollapsibleItem
} from 'react-materialize';

class CollapsibleFilling extends React.Component {
    render() {
        const { header_title, content, ...rest } = this.props;
        return(
            <CollapsibleItem className={rest.class_name} header={<div><span id="collapsible-item-title">{header_title}</span><i className="material-icons chevron-down-collapsible">keyboard_arrow_down</i></div>}>
                {content}
            </CollapsibleItem>
        );
    }
}

export default CollapsibleFilling;
