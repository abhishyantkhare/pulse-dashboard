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

import React, { useState } from "react";

import PageTemplate from "../PageTemplate";
import Loading from "../../../../components/Loading";
import ChartCard from "../../../../components/charts/ChartCard";
import GeoViewTimeChart from "../../../../components/charts/GeoViewTimeChart";
import Methodology from "../../../../components/charts/Methodology";
import OfficerIdWarningIcon from "../../../../components/charts/OfficerIdWarningIcon";
import PeriodLabel from "../../../../components/charts/PeriodLabel";
import RevocationCountByOfficer from "../../../../components/charts/revocations/RevocationCountByOfficer";
import AdmissionCountsByType from "../../../../components/charts/revocations/AdmissionCountsByType";
import CaseTerminationsByOfficer from "../../../../components/charts/revocations/CaseTerminationsByOfficer";
import CaseTerminationsByTerminationType from "../../../../components/charts/revocations/CaseTerminationsByTerminationType";
import RevocationCountOverTime from "../../../../components/charts/revocations/RevocationCountOverTime";
import RevocationCountBySupervisionType from "../../../../components/charts/revocations/RevocationCountBySupervisionType";
import RevocationCountByViolationType from "../../../../components/charts/revocations/RevocationCountByViolationType";
import RevocationProportionByRace from "../../../../components/charts/revocations/RevocationProportionByRace";
import LsirScoreChangeSnapshot from "../../../../components/charts/snapshots/LsirScoreChangeSnapshot";
import RevocationAdmissionsSnapshot from "../../../../components/charts/snapshots/RevocationAdmissionsSnapshot";
import SupervisionSuccessSnapshot from "../../../../components/charts/snapshots/SupervisionSuccessSnapshot";
import ToggleBar from "../../../../components/toggles/ToggleBar";
import * as ToggleDefaults from "../../../../components/toggles/ToggleDefaults";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";

const CommunityExplore = () => {
  const { apiData, isLoading } = useChartData("us_nd/community/explore");
  const [metricType, setMetricType] = useState(ToggleDefaults.metricType);
  const [metricPeriodMonths, setMetricPeriodMonths] = useState(
    ToggleDefaults.metricPeriodMonths
  );
  const [supervisionType, setSupervisionType] = useState(
    ToggleDefaults.supervisionType
  );
  const [district, setDistrict] = useState(ToggleDefaults.district);

  if (isLoading) {
    return <Loading />;
  }

  const toggleBar = (
    <ToggleBar
      setChartMetricType={setMetricType}
      setChartMetricPeriodMonths={setMetricPeriodMonths}
      setChartSupervisionType={setSupervisionType}
      setChartDistrict={setDistrict}
      districtOffices={apiData.site_offices}
      availableDistricts={[
        "beulah",
        "bismarck",
        "bottineau",
        "devils-lake",
        "dickson",
        "fargo",
        "grafton",
        "grand-forks",
        "jamestown",
        "mandan",
        "minot",
        "oakes",
        "rolla",
        "washburn",
        "wahpeton",
        "williston",
      ]}
    />
  );

  return (
    <PageTemplate toggleBar={toggleBar}>
      <ChartCard
        key="revocationCountsByMonth"
        chartId="revocationCountsByMonth"
        chartTitle="REVOCATIONS BY MONTH"
        chart={
          <RevocationCountOverTime
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            geoView={false}
            officeData={apiData.site_offices}
            revocationCountsByMonth={apiData.revocations_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationCountsByMonth"
            chartTitle="REVOCATIONS BY MONTH"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.revocations_by_period}
            numeratorKeys={["revocation_count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="revocationCountsByMonth" />}
      />

      <ChartCard
        key="revocationsByOfficer"
        chartId="revocationsByOfficer"
        chartTitle={
          <>
            REVOCATIONS BY OFFICER
            {district === "all" && <OfficerIdWarningIcon />}
          </>
        }
        chart={
          <RevocationCountByOfficer
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            revocationCountsByOfficer={apiData.revocations_by_officer_by_period}
            officeData={apiData.site_offices}
          />
        }
        footer={
          <>
            <Methodology chartId="revocationsByOfficer" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        key="revocationAdmissionsSnapshot"
        chartId="revocationAdmissionsSnapshot"
        chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
        chart={
          <RevocationAdmissionsSnapshot
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            revocationAdmissionsByMonth={apiData.admissions_by_type_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationAdmissionsSnapshot"
            chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            keyedByOffice
            shareDenominatorAcrossRates
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.admissions_by_type_by_period}
            numeratorKeys={[
              "technicals",
              "non_technicals",
              "unknown_revocations",
            ]}
            denominatorKeys={[
              "technicals",
              "non_technicals",
              "unknown_revocations",
              "new_admissions",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="revocationAdmissionsSnapshot" />}
      />

      <ChartCard
        key="admissionCountsByType"
        chartId="admissionCountsByType"
        chartTitle="ADMISSIONS BY TYPE"
        chart={
          <AdmissionCountsByType
            metricType={metricType}
            supervisionType={supervisionType}
            metricPeriodMonths={metricPeriodMonths}
            district={district}
            admissionCountsByType={apiData.admissions_by_type_by_period}
          />
        }
        footer={
          <>
            <Methodology chartId="admissionCountsByType" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        key="revocationsBySupervisionType"
        chartId="revocationsBySupervisionType"
        chartTitle="REVOCATIONS BY SUPERVISION TYPE"
        chart={
          <RevocationCountBySupervisionType
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            district={district}
            revocationCountsByMonthBySupervisionType={
              apiData.revocations_by_supervision_type_by_month
            }
          />
        }
        footer={<Methodology chartId="revocationsBySupervisionType" />}
      />

      <ChartCard
        chartId="revocationsByViolationType"
        chartTitle="REVOCATIONS BY VIOLATION TYPE"
        chart={
          <RevocationCountByViolationType
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            revocationCountsByMonthByViolationType={
              apiData.revocations_by_violation_type_by_month
            }
          />
        }
        footer={<Methodology chartId="revocationsByViolationType" />}
      />

      <ChartCard
        key="revocationsByRace"
        chartId="revocationsByRace"
        chartTitle="REVOCATIONS BY RACE"
        chart={
          <RevocationProportionByRace
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            revocationProportionByRace={
              apiData.revocations_by_race_and_ethnicity_by_period
            }
            statePopulationByRace={apiData.race_proportions}
          />
        }
        footer={
          <>
            <Methodology chartId="revocationsByRace" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        key="supervisionSuccessSnapshot"
        chartId="supervisionSuccessSnapshot"
        chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
        chart={
          <SupervisionSuccessSnapshot
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            supervisionSuccessRates={
              apiData.supervision_termination_by_type_by_month
            }
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="supervisionSuccessSnapshot"
            chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={
              apiData.supervision_termination_by_type_by_period
            }
            numeratorKeys={["successful_termination"]}
            denominatorKeys={[
              "revocation_termination",
              "successful_termination",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="supervisionSuccessSnapshot" />}
      />

      <ChartCard
        key="caseTerminationsByTerminationType"
        chartId="caseTerminationsByTerminationType"
        chartTitle="CASE TERMINATIONS BY TERMINATION TYPE"
        chart={
          <CaseTerminationsByTerminationType
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            caseTerminationCountsByMonthByTerminationType={
              apiData.case_terminations_by_type_by_month
            }
          />
        }
        footer={<Methodology chartId="caseTerminationsByTerminationType" />}
      />

      <ChartCard
        key="caseTerminationsByOfficer"
        chartId="caseTerminationsByOfficer"
        chartTitle={
          <>
            CASE TERMINATIONS BY OFFICER
            {district === "all" && <OfficerIdWarningIcon />}
          </>
        }
        chart={
          <CaseTerminationsByOfficer
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            terminationCountsByOfficer={
              apiData.case_terminations_by_type_by_officer_by_period
            }
            officeData={apiData.site_offices}
          />
        }
        footer={<Methodology chartId="caseTerminationsByOfficer" />}
      />

      <ChartCard
        key="lsirScoreChangeSnapshot"
        chartId="lsirScoreChangeSnapshot"
        chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
        chart={
          <LsirScoreChangeSnapshot
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            lsirScoreChangeByMonth={apiData.average_change_lsir_score_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="lsirScoreChangeSnapshot"
            chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
            metricType="counts"
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.average_change_lsir_score_by_period}
            numeratorKeys={["average_change"]}
            denominatorKeys={[]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="lsirScoreChangeSnapshot" />}
      />
    </PageTemplate>
  );
};

export default CommunityExplore;
