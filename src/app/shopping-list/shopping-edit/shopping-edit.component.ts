import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient, UnitOfMeasure } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editItem: Ingredient;
  unitOfMeasure: UnitOfMeasure[] = Object.values(UnitOfMeasure);
  unit: string;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editItemIndex = index;
        this.editItem = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount,
          unit: this.editItem.unit || null
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onUpsertIngredient(form: NgForm) {
    const { name, amount, unit } = form.value;
    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editItemIndex,
        new Ingredient(name, amount, unit)
      );
    } else {
      this.shoppingListService.addIngredient(new Ingredient(name, amount, unit));
    }
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.onClear();
    this.shoppingListService.deleteIngredient(this.editItemIndex);
  }
}
