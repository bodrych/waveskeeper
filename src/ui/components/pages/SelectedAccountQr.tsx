import * as React from 'react';
import {connect} from 'react-redux';
import {Trans, translate} from 'react-i18next';
//import * as styles from './styles/accountInfo.styl';
import { Avatar, QRCode, Button } from '../ui';


@translate('extension')
class QRCodeSelectedAccountComponent extends React.PureComponent {

    readonly props;

    render() {
        const address = this.props.selectedAccount.address;

        return <div>
            <Avatar address={address}/>
            <div>{address}</div>
            
            <QRCode width={200}
                    height={200}
                    scale={16}
                    quality={1}
                    margin={1}
                    type='image/png'
                    text={address}/>

            <Button type='submit'>
                <div>
                    <Trans i18nKey='qrCode.download'>Download QR code</Trans>
                </div>
            </Button>
        </div>;
    }
}

const mapStateToProps = function (store: any) {
    const activeAccount = store.selectedAccount.address;
    const selected =  store.localState.assets.account ?  store.localState.assets.account.address : activeAccount;
    const selectedAccount = store.accounts.find(({ address }) => address === selected);
    return {
        selectedAccount,
    };
};



export const QRCodeSelectedAccount = connect(mapStateToProps)(QRCodeSelectedAccountComponent);
