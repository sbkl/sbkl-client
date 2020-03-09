import VTable from "./VTable.vue";
import VModal from "./VModal.vue";
import VForm from "./VForm.vue";
import VActivationButton from "./VActivationButton.vue";
import VDeleteButton from "./VDeleteButton.vue";
import VRelationshipButton from "./VRelationshipButton.vue";
import VRelationshipHeader from "./VRelationshipHeader.vue";
import VUpdateButton from "./VUpdateButton.vue";
import DropdownInput from "./DropdownInput.vue";
import VLoader from "./VLoader.vue";
import VInput from "./VInput.vue";
import VButton from "./VButton.vue";
import VUploadButton from "./VUploadButton.vue";
import VIllustration from "./VIllustration.vue";
import Hamburger from "./Hamburger.vue";
import VDownloadButton from "./VDownloadButton.vue";
import VAvatarPlaceholder from "./VAvatarPlaceholder.vue";
import VDropdownNavIcon from "./VDropdownNavIcon.vue";
import VProfileDropdownActions from "./VProfileDropdownActions.vue";
import VNotificationAction from "./VNotificationAction.vue";
import VNotificationPanel from "./VNotificationPanel.vue";
import VLayoutAdmin from "../layouts/VLayoutAdmin.vue";
import VLayoutElevated from "../layouts/VLayoutElevated.vue";

export const components = {
  install(Vue, options) {
    [
      VTable,
      VModal,
      VForm,
      VActivationButton,
      VDeleteButton,
      VRelationshipButton,
      VRelationshipHeader,
      VUpdateButton,
      DropdownInput,
      VLoader,
      VInput,
      VButton,
      VUploadButton,
      VIllustration,
      Hamburger,
      VDownloadButton,
      VLayoutAdmin,
      VLayoutElevated,
      VAvatarPlaceholder,
      VDropdownNavIcon,
      VProfileDropdownActions,
      VNotificationAction,
      VNotificationPanel
    ].forEach(component => Vue.component(component.name, component));
  }
};
