import { describe, expect, it } from "vitest";
import {
  formatFaNumber,
  readEntityId,
  readStatistic,
} from "../../src/features/account/adManagement/statistics/statisticsHelpers";
import {
  createDailyViewsChart,
  createDailyViewsYAxisLabels,
} from "../../src/features/account/adManagement/statistics/statisticsChartConfigs";
import {
  createYAxisTickFormatter,
  createYAxisTicks,
} from "../../src/features/account/adManagement/statistics/statisticsChartFormatters";

describe("AdVisitStatistics Modularization", () => {
  it("formats persian numbers and reads entities correctly", () => {
    expect(formatFaNumber(1250)).toBe("۱٬۲۵۰");
    expect(readEntityId({ id: 10 })).toBe("10");
    expect(readEntityId({ advertise_id: "adv-99" })).toBe("adv-99");
    expect(readEntityId(null)).toBeUndefined();
  });

  it("reads statistics from ad containers", () => {
    const ad = {
      statistics: {
        total_views: 450,
      },
    };
    expect(readStatistic(ad, ["total_views"])).toBe("۴۵۰");
    expect(readStatistic(ad, ["non_existent"])).toBe("—");
  });

  it("generates daily views chart points and y-axis labels", () => {
    const chart = createDailyViewsChart({
      data: [
        { count: 10, date: "1402/01/01" },
        { count: 20, date: "1402/01/02" },
      ],
      totalView: 30,
    });

    expect(chart.columns).toHaveLength(2);
    expect(chart.columns[0].date).toBe("1402/01/02");
    expect(chart.columns[0].height).toBe(100);

    const labels = createDailyViewsYAxisLabels(9);
    expect(labels).toHaveLength(4);
  });

  it("computes y-axis ticks and formatters", () => {
    const labels = ["۰", "۵۰", "۱۰۰"];
    const ticks = createYAxisTicks(labels);
    expect(ticks).toEqual([0, 50, 100]);

    const formatter = createYAxisTickFormatter(labels);
    expect(formatter(0)).toBe("۱۰۰");
    expect(formatter(100)).toBe("۰");
  });
});
