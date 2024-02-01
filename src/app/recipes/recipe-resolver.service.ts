import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ResolveFn,
} from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService {
  
  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) {}

  addEditClietResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>{
    const recipes = this.recipeService.getRecipes();

    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
