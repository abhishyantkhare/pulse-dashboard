// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import {
  matrixViolationTypeToLabel,
  toInt,
  violationCountLabel,
} from "../../../utils/transforms/labels";

const nullSafeComparison = (a, b) => {
  if (!a && !b) return true;
  if (!a) return false;
  if (!b) return false;
  return a.toLowerCase() === b.toLowerCase();
};

const isAllItem = (item) => item.toLowerCase() === "all";

export const applyTopLevelFilters = (filters) => (
  data,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false
) =>
  data.filter((item) => {
    if (
      filters.metricPeriodMonths &&
      !skippedFilters.includes("metricPeriodMonths") &&
      !nullSafeComparison(item.metric_period_months, filters.metricPeriodMonths)
    ) {
      return false;
    }

    if (
      filters.district &&
      !skippedFilters.includes("district") &&
      !(treatCategoryAllAsAbsent && isAllItem(filters.district)) &&
      !nullSafeComparison(item.district, filters.district)
    ) {
      return false;
    }

    if (
      filters.chargeCategory &&
      !skippedFilters.includes("chargeCategory") &&
      !(treatCategoryAllAsAbsent && isAllItem(filters.chargeCategory)) &&
      !nullSafeComparison(item.charge_category, filters.chargeCategory)
    ) {
      return false;
    }
    if (
      filters.supervisionType &&
      !skippedFilters.includes("supervisionType") &&
      !(treatCategoryAllAsAbsent && isAllItem(filters.supervisionType)) &&
      !nullSafeComparison(item.supervision_type, filters.supervisionType)
    ) {
      return false;
    }
    return true;
  });

const applyMatrixFilters = (filters) => (data) =>
  data.filter((item) => {
    if (
      filters.violationType &&
      !nullSafeComparison(item.violation_type, filters.violationType)
    ) {
      return false;
    }

    if (
      filters.reportedViolations &&
      toInt(item.reported_violations) !== toInt(filters.reportedViolations)
    ) {
      return false;
    }

    return true;
  });

export const applyAllFilters = (filters) => (
  data,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false
) => {
  const filteredData = applyTopLevelFilters(filters)(
    data,
    skippedFilters,
    treatCategoryAllAsAbsent
  );
  return applyMatrixFilters(filters)(filteredData);
};

export const formattedMatrixFilters = (filters) => {
  const parts = [];
  if (filters.violationType) {
    parts.push(matrixViolationTypeToLabel[filters.violationType]);
  }
  if (filters.reportedViolations) {
    parts.push(`${violationCountLabel(filters.reportedViolations)} violations`);
  }
  return parts.join(", ");
};
