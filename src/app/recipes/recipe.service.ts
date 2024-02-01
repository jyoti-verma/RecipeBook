import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient, UnitOfMeasure } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  recipesSet = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {}

  private recipes: Recipe[] = [
    {
    name:"Ing1",
    description:"DEscIng1",
    imagePath:"url1",
    ingredients:[
      {
      name:"Ing11",
      amount:10,
      unit:UnitOfMeasure.KILOGRAM
    },
    {
        name:"Ing12",
        amount:10,
        unit:UnitOfMeasure.KILOGRAM
    }
  ]
  },
  {
    name:"Ing2",
    description:"DEscIng2",
    imagePath:"url2",
    ingredients:[
      {
      name:"Ing11",
      amount:10,
      unit:UnitOfMeasure.KILOGRAM
    },
      {
        name:"Ing12",
        amount:10,
        unit:UnitOfMeasure.KILOGRAM
      }
    ]
   }
  ];

  private triggerRecipeChanged() {
    this.recipesChanged.next(this.getRecipes());
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  getRecipes() {
    return [...this.recipes];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.triggerRecipeChanged();
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.triggerRecipeChanged();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.triggerRecipeChanged();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesSet.next(recipes);
  }

  removeRecipes() {
    this.recipes = [];
    this.recipesChanged.next([]);
  }
}
