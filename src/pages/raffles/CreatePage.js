import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Page, Panel, TextField, Button, Grid } from '@sparkpost/matchbox'

class CreatePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      localpart: '',
      description: '',
      campaign: '',
      started_at: null,
      ended_at: null,
      email_data: null
    }
    this.handInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleCreate (values) {
    // return create(values)
    //  .then(() => this.setState({ shouldRedirect: true }));
  }

  render () {
    return (
      <div>
        <Page title='Create a new Raffle'
          primaryAction={{content: 'Save', onClick: (values) => this.handleCreate(values)}}
          breadcrumbAction={{content: 'Raffles', Component: Link, to: '/admin/'}}
        />
        <Panel accent sectioned>
          <form>
            <TextField
              id='name'
              label='Name'
              placeholder='Name'
              value={this.state.name}
              onChange={this.handleInputChange}
            />
            <TextField
              id='localpart'
              label='Raffle Email Address'
              placeholder='Localpart'
              connectRight={<Button disabled>@raffle.sparkpost.com</Button>}
            />
            <TextField
              id='description'
              label='Description'
              multiline
            />
            <TextField
              id='campaign'
              label='Campaign'
              placeholder='Campaign'
            />
            <Grid>
              <Grid.Column>
                <TextField
                  id='started_at'
                  label='Start Date'
                  placeholder='Start Date'
                />
              </Grid.Column>
              <Grid.Column>
                <TextField
                  id='ended_at'
                  label='End Date'
                  placeholder='End Date'
                />
              </Grid.Column>
            </Grid>
            <TextField
              id='email_data'
              label='Email Data'
              multiline
            />
          </form>
        </Panel>
      </div>
    )
  }
}

export default CreatePage
