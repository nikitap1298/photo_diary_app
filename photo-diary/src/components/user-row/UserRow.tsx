import React from "react"
import {
  IonGrid,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from "@ionic/react"
import { trash } from "ionicons/icons"
import { UserInterface } from "../../lib/interfaces/user.interface"

interface UserRowProps {
  user: UserInterface
  isOwner: boolean
  onRemove: (user: UserInterface) => void
}

export default function UserRow(props: UserRowProps): JSX.Element {
  const { user, isOwner, onRemove } = props

  return (
    <div className="user-row">
      <IonItemSliding>
        <IonItem>
          <IonGrid>
            <IonLabel>
              <h3>{user.userName}</h3>
            </IonLabel>
          </IonGrid>
        </IonItem>

        {isOwner ? (
          <IonItemOptions>
            <IonItemOption color="danger">
              <IonIcon slot="icon-only" icon={trash} onClick={(): void => onRemove(user)}></IonIcon>
            </IonItemOption>
          </IonItemOptions>
        ) : null}
      </IonItemSliding>
    </div>
  )
}
