import {cursor} from '@airtable/blocks';
import {
  initializeBlock, 
  useBase, 
  useRecords, 
  useWatchable, 
  useLoadable, 
  useGlobalConfig,
  Box,
  Label,
  Heading,
  Text,
  CellRenderer,
  TextButton, 
  TablePickerSynced} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React from 'react';

const App = () => {
  const base = useBase();
  const table = base.getTableByNameIfExists("Tasks");
  const statusField = table.getFieldByName("status");
  const records = useRecords(table) || [];
  useLoadable(cursor);
  useWatchable(cursor, 'selectedRecordIds');

  if (cursor.selectedRecordIds.length > 0) {
    const recordId = cursor.selectedRecordIds[0];
    console.log(recordId);
    const record = records.filter(r => r.id == recordId)[0];
    console.log(record);
    return (
      <Record record={record} statusField={statusField}/>
    )  
  } else {
    return (<Heading>Please select a task</Heading>)
  }
}

const Record = ({record, statusField}) => {
  const apiKey = "***";
  const lat = record.getCellValue("lat");
  const lng = record.getCellValue("lng");
  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${lat},${lng}`;
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Text id="description" size="large" style={{paddingBottom: '0.5em'}}>{record.getCellValueAsString("message")}</Text>
      <iframe
        width="100%"
        height="250"
        frameBorder="0"        
        src={mapUrl}>
      </iframe>
      <Text style={{paddingTop: '0.5em', textAlign: 'right'}}>{record.getCellValueAsString("address") + ", " + record.getCellValueAsString("city")}</Text>
      <Label htmlFor="status">Status</Label>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>        
        <CellRenderer field={statusField} record={record}/>
        <div style={{display: 'flex', alignItems: 'center'}}>
          { record.getCellValueAsString("_collaborator_photo_url") ? 
          <img style={{width: '32px', height: '32px', borderRadius: '50%', marginRight: '0.5em'}} src={record.getCellValueAsString("_collaborator_photo_url")}/> : null }          
          <div>{record.getCellValueAsString("_collaborator_name")}</div>          
        </div>
      </div>

    </div>
  )
}

initializeBlock(() => <App />);
