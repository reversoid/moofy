import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';

export type OptionId = 'ALL' | 'UNREAD';

type Option = {
  label: string;
  id: OptionId;
};

@Component({
  selector: 'app-notifications-shown-select',
  standalone: true,
  imports: [TuiSelectModule, FormsModule, TuiTextfieldControllerModule, TuiDataListModule, NgFor],
  templateUrl: './notifications-shown-select.component.html',
  styleUrl: './notifications-shown-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsShownSelectComponent {
  private optionsMap: Record<OptionId, string> = {
    ALL: 'Все',
    UNREAD: 'Непрочитанные',
  };

  options: Option[] = Object.keys(this.optionsMap).map<Option>((id) => ({
    id: id as OptionId,
    label: this.optionsMap[id as OptionId],
  }));

  get currentOptionName() {
    return this.optionsMap[this.selectedOption];
  }

  @Input() selectedOption: OptionId = 'UNREAD';

  @Output() selectedOptionChange = new EventEmitter<OptionId>();
}
