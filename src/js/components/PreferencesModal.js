import * as React from 'react'
import Styles from './styles'
import * as Constants from './constants'
import * as Modal from './Modal'
import * as Util from './util'

class PreferencesModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      prefs: props.initialPrefs
    }
    console.log('PreferencesModal: initialPrefs: ', props.initialPrefs.toJS())
  }

  handleKeyDown (e) {
    if (e.keyCode === Constants.KEY_ESC) {
      // ESC key
      e.preventDefault()
      this.props.onClose(e)
    } else if (e.keyCode === Constants.KEY_ENTER) {
      this.handleSubmit(e)
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSubmit(this.state.prefs)
  }

  handlePopStartChange (e) {
    const oldPrefs = this.state.prefs
    const nextPrefs = oldPrefs.set('popoutOnStart', !oldPrefs.popoutOnStart)
    this.setState({prefs: nextPrefs})
  }

  render () {
    const popStart = this.state.prefs.popoutOnStart

    return (
      <Modal.Dialog title='Tabli Preferences' onClose={this.props.onClose}>
        <Modal.Body>
          <div className='container'>
            <form className='dialog-form form-inline preferences-form' onSubmit={this.handleSubmit}>
              <div className='checkbox'>
                <label>
                  <input
                    type='checkbox'
                    checked={popStart}
                    onChange={e => this.handlePopStartChange(e)}
                  />
                  Show Tabli Popout Window at Startup
                </label>
              </div>
            </form>
            <hr />
            <div style={Util.merge(Styles.alignRight, Styles.dialogButtonRow)}>
              <button
                type='button'
                className='btn btn-primary btn-sm tabli-dialog-button'
                onClick={e => this.handleSubmit(e)}
                ref='okButton'
                tabIndex={0}
                onKeyDown={this.handleKeyDown}>
                OK
              </button>
              <button
                type='button'
                className='btn btn-default btn-sm tabli-dialog-button'
                onClick={e => this.props.onClose(e)}
                tabIndex={0}>
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal.Dialog>
    )
  }
}

export default PreferencesModal
