import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, Header, Icon, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

import { KittyAvatar } from './kitty-avatar';

function hexToString (hex) {
  hex = hex.substr(2);

  let string = '';
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return string;
}

function calculatePower (hex) {
  hex = hex.substr(2);
  return parseInt(hex[parseInt(hex[hex.length - 1], 16)], 16);
}

function Main (props) {
  const { api } = useSubstrate();
  const [kittyCommodities, setKittyCommodities] = useState([]);
  const [kitties, setKitties] = useState([]);
  useEffect(() => {
    let unsubscribe;
    api.query.kittiesCommodities.commoditiesForAccount(props.accountPair.address, (userKitties) => {
      setKittyCommodities(userKitties || []);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, [api.query.kittiesCommodities, props.accountPair.address]);

  useEffect(() => {
    const kitties = [];
    const kittyIds = kittyCommodities.map((kitty) => kitty.CommodityId);
    let unsubscribe;
    api.query.substratekitties.metadataForKitty.multi(kittyIds, (allMetadata) => {
      allMetadata.forEach((metadata, ndx) => {
        const dna = kittyCommodities[ndx].CommodityInfo.dna.toHex();
        kitties.push({
          id: kittyCommodities[ndx].CommodityId.toHex(),
          dna: dna,
          dob: new Date(kittyCommodities[ndx].CommodityInfo.dob.toNumber()),
          name: hexToString(`${metadata.name}`),
          power: calculatePower(`${dna}`)
        });
      });

      setKitties(kitties);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, [kittyCommodities, api.query.substratekitties.metadataForKitty]);

  return (
    <Grid.Column>
      <Card.Group itemsPerRow={3}>
        {kitties.map((kitty) => {
          console.log(kitty)
          return <Card 
            key={kitty.id}
            raised
          >
            <Card.Content>
              <Grid padded={false}>
                <Grid.Column width={10}>
                  <h4>{kitty.name}</h4>
                </Grid.Column>
                <Grid.Column width={6} textAlign='right'>
                  <Icon link name='eraser'/>
                  <Icon link name='heart'/>
                  <Icon link name='shopping basket'/>
                </Grid.Column>
              </Grid>
            </Card.Content>
            <Card.Content textAlign='center'>
              <KittyAvatar dna={kitty.dna} />

              <Button.Group basic compact size='tiny'>
                <Button>
                  kitty.id
                  <br/>
                  <b>ID</b>
                </Button>
                <Button>
                  owner.id
                  <br/>
                  <b>owner</b>
                </Button>
                <Button>
                  {kitty.power}
                  <br/>
                  <b>Power</b>
                </Button>
                <Button>
                  <Icon name='heart'/>
                  <br/>
                  <b>Flirt</b>
                </Button>
                <Button>
                  <Icon name='shopping basket'/>
                  <br/>
                  <b>Buy</b>
                </Button>
              </Button.Group>
              
            </Card.Content>
          </Card>;
        })}
      </Card.Group>
    </Grid.Column>
  );
}

export default function Substratekitties (props) {
  const { api } = useSubstrate();
  return api.query.kittiesCommodities &&
         api.query.substratekitties.metadataForKitty &&
         props.accountPair
    ? <Main {...props} />
    : null;
}
