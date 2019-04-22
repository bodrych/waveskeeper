import * as React from 'react';
import { connect } from 'react-redux';
import { Input, DateFormat, Button, BUTTON_TYPE } from 'ui/components/ui';
import { translate, Trans } from 'react-i18next';
import { setActiveNotification } from 'ui/actions';
import {
    updateActiveMessage,
    getAsset,
    approve,
    reject,
    clearMessagesStatus,
    clearMessages,
    closeNotificationWindow,
    setShowNotification,
    setAutoOrigin,
    deleteNotifications,
} from '../../actions';
import { PAGES } from '../../pageConfig';
import { I18N_NAME_SPACE } from '../../appConfig';
import { TransactionWallet } from '../wallets';
import * as styles from './styles/messageList.styl';

const NotificationItem = ({ notification }) => (
    <div className={`margin-main-big`}>
        <div className={`${styles.messageItemInner} margin-2`}>
            <div className="flex">
                <div className={styles.messageIcon} />
                <div className={styles.messageTitle}>
                    <div className="basic500">{notification && notification.origin}</div>
                    <h2 className="">{notification && notification.title}</h2>
                </div>
            </div>
            <div className={styles.messageText}>{notification && notification.message}</div>
        </div>
        <div className={styles.timestamp}>
            <div className="basic500 margin-min">
                <Trans i18nKey='notifications.time'>Time</Trans>
            </div>
            <DateFormat value={notification.timestamp}/>
        </div>
    </div>
);

@translate(I18N_NAME_SPACE)
class NotificationsComponent extends React.Component {
    
    readonly state = {} as any;
    readonly props;
    
    closeHandler = (e) => {
        this._deleteMessages();
        this.props.closeNotificationWindow();
    };
    
    toListHandler = () => {
        this._deleteMessages();
        this.props.setTab(PAGES.MESSAGES_LIST);
    };
    
    toggleCanShowHandler = (e) => {
        const canUse = e.target.checked;
        this.props.setShowNotification({ origin: this.state.origin, canUse });
    };
    
    nextHandler = (e) => {
        const nextNotification = this.state.notifications.filter(([item]) => item.origin !== this.state.origin)[0];
        this._deleteMessages();
        this.props.setActiveNotification(nextNotification || null);
    };
    
    selectAccountHandler = () => this.props.setTab(PAGES.CHANGE_TX_ACCOUNT);
    
    componentDidCatch(error, info) {
        this.toListHandler();
    }
    
    render() {
        const { activeNotification } = this.state;
        return (
            <div className={styles.messageList}>
                <div className={styles.messageListScrollBox}>
                    {
                        activeNotification
                            .map(notification => (
                                    <NotificationItem notification={notification} key={notification.id}/>
                                )
                            )
                    }
                    
                    <div className={`margin-main-big margin-main-big-top flex ${styles.allowNotification}`}>
                        <Input id='checkbox_noshow' type={'checkbox'} checked={this.state.canShowNotify}
                               onChange={this.toggleCanShowHandler}/>
                        <label htmlFor='checkbox_noshow'>
                            <Trans i18nkey='notifications.allowSending'>Allow sending messages</Trans>
                        </label>
                    </div>
                    
                    <div className="margin-main-big-top;">
                        {
                            this.state.hasMessages &&
                            <Button type={BUTTON_TYPE.INTERFACE} onClick={this.toListHandler}>
                                <Trans i18nKey='notifications.toListBtn'>Notifications</Trans>
                            </Button>
                        }
                        
                        {
                            this.state.hasNotifications &&
                            <Button type={BUTTON_TYPE.GENERAL} onClick={this.nextHandler}>
                                <Trans i18nKey='notifications.nextBtn'>Next</Trans>
                            </Button>
                        }
                        
                        {
                            this.state.showClose &&
                            <Button type={BUTTON_TYPE.GENERAL} onClick={this.closeHandler}>
                                <Trans i18nKey='notifications.closeBtn'>Close</Trans>
                            </Button>
                        }
                    </div>
                </div>
                
                <TransactionWallet onSelect={this.selectAccountHandler} account={this.props.selectedAccount}
                                   hideButton={false}/>
            </div>
        );
    }
    
    _deleteMessages() {
        return this.props.deleteNotifications(this.state.activeNotification.map(({ id }) => id));
    }
    
    static getDerivedStateFromProps(props, state) {
        const { origins, activeNotification, messages, notifications } = props;
        const origin = activeNotification[0].origin;
        const perms = origins[origin];
        const canShowNotify = !!perms.find((item) => item && item.type === 'useNotifications');
        const hasMessages = messages.length > 0;
        const hasNotifications = notifications.filter(([item]) => item.origin !== origin).length > 0;
        
        return {
            canShowNotify,
            messages,
            activeNotification,
            origin,
            hasMessages,
            hasNotifications,
            notifications,
            showClose: !hasNotifications && !hasMessages
        };
    }
}

const mapStateToProps = function(store) {
    return {
        selectedAccount: store.selectedAccount,
        activeNotification: store.activeNotification,
        origins: store.origins,
        messages: store.messages,
        notifications: store.notifications,
    };
};

const actions = {
    closeNotificationWindow,
    setShowNotification,
    setActiveNotification,
    deleteNotifications,
};

export const Notifications = connect(mapStateToProps, actions)(NotificationsComponent);
