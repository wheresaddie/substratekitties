import React, { useState } from 'react';
import styled from 'styled-components';
import theme from './theme';
import { Container, Grid, Input, Tab } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';


const ConsoleWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  // height: 200px;
  width: 100%;
  max-height: 100vh;

  && {
    &, .ui.segment, .menu, .menu .item {
      border: none;
      border-color: transparent;
      color: ${theme.colors.console.text};
      background: ${theme.colors.console.bg};
    }

    .menu:before {
      content: '';
      display: block;
      position: absolute;
      z-index: 1;
      top: 40px;
      left: 0;
      height: 1px;
      width: 100vw;
      background: ${theme.colors.brand.bg};
      opacity: 0.3;
    }

    .menu .item {
      &, &.active, &:hover {
        color: ${theme.colors.console.text};
        text-transform: lowercase;
      }
      &.active {
        background: ${theme.colors.console.highlight};
      }
      &.close {
        position: absolute;
        right: 0;
        &.active {
          opacity: 0;
        }
      }
    }

    code, input, button {
      font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    }

    input {
      color: ${theme.colors.console.text};
      border: none;
      &, &:active, &:focus, ::placeholder {
        background: ${theme.colors.console.input};
        color: ${theme.colors.console.text};
      }
      ::placeholder {
        color: black !important;
      }
    }
  }
`

// TODO: abstract call string and callable
function Main (props) {
  const [name, setName] = useState('');
  const handleChange = e => {
    setName(e.target.value);
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width='14'>
          <code>
            api.tx.substratekitties.conjure('
            <Input
              placeholder='Give kitty a name'
              onChange={handleChange}
            />
            ').signAndSend(props.accountPair)
          </code>
        </Grid.Column>
        <Grid.Column width='2' textAlign='right'>
          <TxButton
            color='green'
            accountPair={props.accountPair}
            setStatus={setName}
            label='Execute'
            type={'SIGNED-TX'}
            attrs={{
              palletRpc: 'substratekitties',
              callable: 'conjure',
              inputParams: [name],
              paramFields: ['']
            }}
          />
          </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default function Substratekitties (props) {
  const { api } = useSubstrate();
  const panes = [
    { menuItem: 'Conjure', render: () => <Tab.Pane><Main {...props}/></Tab.Pane> },
    { menuItem: {icon: 'close', className: 'close'}, render: () => <></> }
  ];

  return api.query.kittiesCommodities &&
         api.query.substratekitties.metadataForKitty &&
         props.accountPair 
    ? <ConsoleWrap>
      <Container>
        <Tab panes={panes} />
      </Container>
    </ConsoleWrap>
    : null;
}
